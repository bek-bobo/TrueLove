import { useEffect, useRef } from 'react';

/**
 * Passive & boundary scroll-locking hook for touch devices:
 * Prevents the outer window/body from "jumping" or scrolling while
 * the user is actively interacting with the dossier or chat viewport.
 */
export function useTouchScrollLock<T extends HTMLElement = HTMLDivElement>(isActive: boolean = true) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!isActive) return;
    const el = containerRef.current;
    if (!el) return;

    let touchStartY = 0;
    let isTouchingInside = false;

    // Passive touchstart: records start position and marks active interaction
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
        isTouchingInside = true;
        document.body.classList.add('dossier-touch-active');
      }
    };

    // Passive touchend & touchcancel: cleans up active interaction state
    const handleTouchEnd = () => {
      isTouchingInside = false;
      document.body.classList.remove('dossier-touch-active');
    };

    // Touchmove: prevents overscroll chaining and parent window jumping
    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouchingInside || e.touches.length !== 1) return;

      // Find nearest scrollable container between touch target and root container
      let target = e.target as HTMLElement | null;
      let scrollableElement: HTMLElement | null = null;

      while (target && target !== el && target !== document.body) {
        const style = window.getComputedStyle(target);
        const overflowY = style.overflowY;
        if (
          (overflowY === 'auto' || overflowY === 'scroll') &&
          target.scrollHeight > target.clientHeight
        ) {
          scrollableElement = target;
          break;
        }
        target = target.parentElement;
      }

      // 1. If the touch is on a non-scrollable element (cards, buttons, interactive tools, stamps)
      // and there is no scrollable descendant nearby, let the browser handle it natively.
      // Previously this called e.preventDefault() unconditionally here, which froze the
      // ENTIRE page on mobile whenever a step (e.g. Cover / Clearance) had no inner
      // overflow-y-auto container of its own — that was the mobile "stuck scroll" bug.
      if (!scrollableElement) {
        return;
      }

      // 2. If user is touching a scrollable element (e.g. chat messages or letter text)
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - touchStartY;
      const atTop = scrollableElement.scrollTop <= 0;
      const atBottom =
        scrollableElement.scrollTop + scrollableElement.clientHeight >=
        scrollableElement.scrollHeight - 1;

      // Lock parent from jumping when trying to pull down past top or push up past bottom
      if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    el.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('touchcancel', handleTouchEnd);
      document.body.classList.remove('dossier-touch-active');
    };
  }, [isActive]);

  return containerRef;
}
