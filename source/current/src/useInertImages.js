import { useEffect } from 'react';

// Image-only interaction rules. Text selection, links and browser page controls stay native.
export function useInertImages() {
  useEffect(() => {
    const root = document.querySelector('.v9');
    if (!root) return;
    const prepare = node => {
      if (!(node instanceof Element)) return;
      if (node.matches('img')) node.draggable = false;
      node.querySelectorAll('img').forEach(image => { image.draggable = false; });
    };
    prepare(root);
    const observer = new MutationObserver(records => {
      records.forEach(record => record.addedNodes.forEach(prepare));
    });
    observer.observe(root, { childList: true, subtree: true });
    const imageTarget = event => {
      const target = event.target instanceof Element ? event.target : event.target?.parentElement;
      if (!target) return false;
      if (target.closest('img,[data-image-surface]')) return true;
      // Decorative PNGs may have pointer-events:none; do not let their empty pixels
      // intercept text or link context menus underneath them.
      if (target.closest('p,h1,h2,h3,li,span,strong,small,a,button,summary,input,textarea,select,[contenteditable]')) return false;
      return [...root.querySelectorAll('img')].some(image => {
        const style = getComputedStyle(image);
        if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
        const box = image.getBoundingClientRect();
        let left = box.left, right = box.right, top = box.top, bottom = box.bottom;
        // Honor card/decor clipping when hit-testing pointer-transparent PNGs.
        for (let parent = image.parentElement; parent && parent !== root; parent = parent.parentElement) {
          const parentStyle = getComputedStyle(parent), clip = parent.getBoundingClientRect();
          if (/hidden|clip|auto|scroll/.test(parentStyle.overflowX)) {
            left = Math.max(left, clip.left); right = Math.min(right, clip.right);
          }
          if (/hidden|clip|auto|scroll/.test(parentStyle.overflowY)) {
            top = Math.max(top, clip.top); bottom = Math.min(bottom, clip.bottom);
          }
        }
        return right > left && bottom > top && event.clientX >= left && event.clientX <= right && event.clientY >= top && event.clientY <= bottom;
      });
    };
    const preventImageInteraction = event => {
      if (imageTarget(event)) event.preventDefault();
    };
    const events = ['contextmenu', 'dragstart', 'dragover', 'selectstart', 'drop'];
    events.forEach(name => root.addEventListener(name, preventImageInteraction, true));
    return () => {
      observer.disconnect();
      events.forEach(name => root.removeEventListener(name, preventImageInteraction, true));
    };
  }, []);
}
