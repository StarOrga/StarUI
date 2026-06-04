type Axis = 'x' | 'y';

type HostState = {
  host: HTMLElement;
  railX: HTMLDivElement;
  railY: HTMLDivElement;
  thumbX: HTMLDivElement;
  thumbY: HTMLDivElement;
  resizeObserver: ResizeObserver;
  activityTimer: number | null;
  removePositionOverride: boolean;
  drag:
    | {
        axis: Axis;
        pointerId: number;
        startPointer: number;
        startScroll: number;
      }
    | null;
  cleanup: Array<() => void>;
};

const SCROLL_EPSILON = 1;
const ACTIVITY_TIMEOUT_MS = 720;
const SCROLLABLE_OVERFLOW_VALUES = new Set(['auto', 'scroll', 'overlay']);

export function installCustomScrollbars(root: Document | HTMLElement = document): () => void {
  const rootElement = root instanceof Document ? root.body : root;
  if (!rootElement) {
    return () => {};
  }

  const states = new Map<HTMLElement, HostState>();
  let refreshFrame = 0;

  const scheduleRefresh = () => {
    if (refreshFrame) {
      return;
    }
    refreshFrame = window.requestAnimationFrame(() => {
      refreshFrame = 0;
      refreshAll();
    });
  };

  const refreshAll = () => {
    const seen = new Set<HTMLElement>();
    const elements = [rootElement, ...Array.from(rootElement.querySelectorAll<HTMLElement>('*'))];
    elements.forEach((element) => {
      if (!isScrollableCandidate(element)) {
        return;
      }
      seen.add(element);
      const state = states.get(element) ?? createState(element);
      states.set(element, state);
      syncState(state);
    });

    Array.from(states.entries()).forEach(([element, state]) => {
      if (!seen.has(element) || !element.isConnected || !isScrollableCandidate(element)) {
        destroyState(state);
        states.delete(element);
      }
    });
  };

  const rootMutationObserver = new MutationObserver(() => scheduleRefresh());
  rootMutationObserver.observe(rootElement, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });

  const onWindowResize = () => scheduleRefresh();
  window.addEventListener('resize', onWindowResize, { passive: true });

  refreshAll();

  return () => {
    if (refreshFrame) {
      window.cancelAnimationFrame(refreshFrame);
    }
    rootMutationObserver.disconnect();
    window.removeEventListener('resize', onWindowResize);
    Array.from(states.values()).forEach((state) => destroyState(state));
    states.clear();
  };

  function createState(host: HTMLElement): HostState {
    const shouldOverridePosition = getComputedStyle(host).position === 'static' && !host.style.position;
    if (shouldOverridePosition) {
      host.style.position = 'relative';
    }

    host.classList.add('app-custom-scroll-host');

    const railY = createRail('y');
    const railX = createRail('x');
    const thumbY = railY.querySelector<HTMLDivElement>('.app-custom-scrollbar__thumb') as HTMLDivElement;
    const thumbX = railX.querySelector<HTMLDivElement>('.app-custom-scrollbar__thumb') as HTMLDivElement;
    host.append(railY, railX);

    const resizeObserver = new ResizeObserver(() => syncState(state));
    resizeObserver.observe(host);

    const state: HostState = {
      host,
      railX,
      railY,
      thumbX,
      thumbY,
      resizeObserver,
      activityTimer: null,
      removePositionOverride: shouldOverridePosition,
      drag: null,
      cleanup: [],
    };

    const onScroll = () => {
      syncState(state);
      showActivity(state);
    };
    host.addEventListener('scroll', onScroll, { passive: true });
    state.cleanup.push(() => host.removeEventListener('scroll', onScroll));

    const onMouseEnter = () => showActivity(state);
    const onMouseLeave = () => scheduleHide(state);
    host.addEventListener('mouseenter', onMouseEnter);
    host.addEventListener('mouseleave', onMouseLeave);
    state.cleanup.push(() => host.removeEventListener('mouseenter', onMouseEnter));
    state.cleanup.push(() => host.removeEventListener('mouseleave', onMouseLeave));

    const onWheel = () => showActivity(state);
    host.addEventListener('wheel', onWheel, { passive: true });
    state.cleanup.push(() => host.removeEventListener('wheel', onWheel));

    bindDrag(state, railY, thumbY, 'y');
    bindDrag(state, railX, thumbX, 'x');
    syncState(state);
    return state;
  }

  function destroyState(state: HostState): void {
    if (state.activityTimer) {
      window.clearTimeout(state.activityTimer);
    }
    state.resizeObserver.disconnect();
    state.cleanup.forEach((cleanup) => cleanup());
    state.railX.remove();
    state.railY.remove();
    state.host.classList.remove(
      'app-custom-scroll-host',
      'app-custom-scroll-host--active-x',
      'app-custom-scroll-host--active-y',
      'app-custom-scroll-host--visible',
      'app-custom-scroll-host--dragging'
    );
    if (state.removePositionOverride) {
      state.host.style.position = '';
    }
  }

  function bindDrag(state: HostState, rail: HTMLDivElement, thumb: HTMLDivElement, axis: Axis): void {
    const onThumbPointerDown = (event: PointerEvent) => {
      event.preventDefault();
      thumb.setPointerCapture(event.pointerId);
      thumb.classList.add('is-dragging');
      state.host.classList.add('app-custom-scroll-host--dragging');
      state.drag = {
        axis,
        pointerId: event.pointerId,
        startPointer: axis === 'y' ? event.clientY : event.clientX,
        startScroll: axis === 'y' ? state.host.scrollTop : state.host.scrollLeft,
      };
      showActivity(state, true);
    };

    const onThumbPointerMove = (event: PointerEvent) => {
      if (!state.drag || state.drag.axis !== axis || state.drag.pointerId !== event.pointerId) {
        return;
      }
      const pointer = axis === 'y' ? event.clientY : event.clientX;
      const delta = pointer - state.drag.startPointer;
      const trackSize = axis === 'y' ? rail.clientHeight : rail.clientWidth;
      const thumbSize = axis === 'y' ? thumb.offsetHeight : thumb.offsetWidth;
      const scrollRange = axis === 'y'
        ? state.host.scrollHeight - state.host.clientHeight
        : state.host.scrollWidth - state.host.clientWidth;
      const travelRange = Math.max(trackSize - thumbSize, 1);
      const scrollDelta = (delta / travelRange) * scrollRange;
      if (axis === 'y') {
        state.host.scrollTop = state.drag.startScroll + scrollDelta;
      } else {
        state.host.scrollLeft = state.drag.startScroll + scrollDelta;
      }
      syncState(state);
      showActivity(state, true);
    };

    const finishDrag = () => {
      state.drag = null;
      thumb.classList.remove('is-dragging');
      state.host.classList.remove('app-custom-scroll-host--dragging');
      scheduleHide(state);
    };

    const onThumbPointerUp = (event: PointerEvent) => {
      if (thumb.hasPointerCapture(event.pointerId)) {
        thumb.releasePointerCapture(event.pointerId);
      }
      finishDrag();
    };

    const onRailPointerDown = (event: PointerEvent) => {
      if (event.target === thumb) {
        return;
      }
      event.preventDefault();
      const rect = rail.getBoundingClientRect();
      const thumbSize = axis === 'y' ? thumb.offsetHeight : thumb.offsetWidth;
      const offset = axis === 'y' ? event.clientY - rect.top : event.clientX - rect.left;
      const trackSize = axis === 'y' ? rect.height : rect.width;
      const travelRange = Math.max(trackSize - thumbSize, 1);
      const nextOffset = clamp(offset - (thumbSize / 2), 0, travelRange);
      const scrollRange = axis === 'y'
        ? state.host.scrollHeight - state.host.clientHeight
        : state.host.scrollWidth - state.host.clientWidth;
      const ratio = scrollRange <= 0 ? 0 : nextOffset / travelRange;
      if (axis === 'y') {
        state.host.scrollTop = ratio * scrollRange;
      } else {
        state.host.scrollLeft = ratio * scrollRange;
      }
      syncState(state);
      showActivity(state, true);
    };

    thumb.addEventListener('pointerdown', onThumbPointerDown);
    thumb.addEventListener('pointermove', onThumbPointerMove);
    thumb.addEventListener('pointerup', onThumbPointerUp);
    thumb.addEventListener('pointercancel', finishDrag);
    thumb.addEventListener('lostpointercapture', finishDrag);
    rail.addEventListener('pointerdown', onRailPointerDown);

    state.cleanup.push(() => thumb.removeEventListener('pointerdown', onThumbPointerDown));
    state.cleanup.push(() => thumb.removeEventListener('pointermove', onThumbPointerMove));
    state.cleanup.push(() => thumb.removeEventListener('pointerup', onThumbPointerUp));
    state.cleanup.push(() => thumb.removeEventListener('pointercancel', finishDrag));
    state.cleanup.push(() => thumb.removeEventListener('lostpointercapture', finishDrag));
    state.cleanup.push(() => rail.removeEventListener('pointerdown', onRailPointerDown));
  }

  function syncState(state: HostState): void {
    const { host } = state;
    const style = getComputedStyle(host);
    const canScrollY = SCROLLABLE_OVERFLOW_VALUES.has(style.overflowY) && host.scrollHeight - host.clientHeight > SCROLL_EPSILON;
    const canScrollX = SCROLLABLE_OVERFLOW_VALUES.has(style.overflowX) && host.scrollWidth - host.clientWidth > SCROLL_EPSILON;

    host.classList.toggle('app-custom-scroll-host--active-y', canScrollY);
    host.classList.toggle('app-custom-scroll-host--active-x', canScrollX);

    state.railY.hidden = !canScrollY;
    state.railX.hidden = !canScrollX;

    if (canScrollY) {
      updateThumb(state, 'y');
    }
    if (canScrollX) {
      updateThumb(state, 'x');
    }
  }

  function updateThumb(state: HostState, axis: Axis): void {
    const host = state.host;
    const rail = axis === 'y' ? state.railY : state.railX;
    const thumb = axis === 'y' ? state.thumbY : state.thumbX;
    const viewportSize = axis === 'y' ? host.clientHeight : host.clientWidth;
    const contentSize = axis === 'y' ? host.scrollHeight : host.scrollWidth;
    const scrollOffset = axis === 'y' ? host.scrollTop : host.scrollLeft;
    const trackSize = axis === 'y' ? rail.clientHeight : rail.clientWidth;
    const minThumbSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--app-scrollbar-thumb-min-size')) || 36;
    const thumbSize = clamp((viewportSize / contentSize) * trackSize, minThumbSize, trackSize);
    const scrollRange = Math.max(contentSize - viewportSize, 1);
    const travelRange = Math.max(trackSize - thumbSize, 0);
    const thumbOffset = travelRange * (scrollOffset / scrollRange);

    if (axis === 'y') {
      thumb.style.height = `${thumbSize}px`;
      thumb.style.transform = `translate3d(0, ${thumbOffset}px, 0)`;
    } else {
      thumb.style.width = `${thumbSize}px`;
      thumb.style.transform = `translate3d(${thumbOffset}px, 0, 0)`;
    }
  }

  function showActivity(state: HostState, keepVisible = false): void {
    state.host.classList.add('app-custom-scroll-host--visible');
    if (state.activityTimer) {
      window.clearTimeout(state.activityTimer);
      state.activityTimer = null;
    }
    if (keepVisible) {
      return;
    }
    state.activityTimer = window.setTimeout(() => {
      if (state.drag) {
        return;
      }
      state.host.classList.remove('app-custom-scroll-host--visible');
      state.activityTimer = null;
    }, ACTIVITY_TIMEOUT_MS);
  }

  function scheduleHide(state: HostState): void {
    if (state.drag) {
      return;
    }
    if (state.activityTimer) {
      window.clearTimeout(state.activityTimer);
    }
    state.activityTimer = window.setTimeout(() => {
      if (state.drag || state.host.matches(':hover')) {
        state.activityTimer = null;
        return;
      }
      state.host.classList.remove('app-custom-scroll-host--visible');
      state.activityTimer = null;
    }, 120);
  }
}

function createRail(axis: Axis): HTMLDivElement {
  const rail = document.createElement('div');
  rail.className = `app-custom-scrollbar app-custom-scrollbar--${axis}`;
  rail.setAttribute('aria-hidden', 'true');

  const track = document.createElement('div');
  track.className = 'app-custom-scrollbar__track';

  const thumb = document.createElement('div');
  thumb.className = 'app-custom-scrollbar__thumb';

  rail.append(track, thumb);
  return rail;
}

function isScrollableCandidate(element: HTMLElement): boolean {
  if (!element.isConnected || element.hidden) {
    return false;
  }
  if (element.classList.contains('app-custom-scrollbar') || element.classList.contains('app-custom-scrollbar__thumb')) {
    return false;
  }
  if (
    element instanceof HTMLHtmlElement ||
    element instanceof HTMLBodyElement ||
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLButtonElement
  ) {
    return false;
  }

  const style = getComputedStyle(element);
  if (style.display === 'inline' || style.display === 'contents' || style.visibility === 'hidden') {
    return false;
  }

  const canScrollY = SCROLLABLE_OVERFLOW_VALUES.has(style.overflowY) && element.scrollHeight - element.clientHeight > SCROLL_EPSILON;
  const canScrollX = SCROLLABLE_OVERFLOW_VALUES.has(style.overflowX) && element.scrollWidth - element.clientWidth > SCROLL_EPSILON;
  return canScrollX || canScrollY;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
