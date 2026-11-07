/**
 * Index after a step, wrapping at both ends.
 * @param {number} index
 * @param {number} step
 * @param {number} length
 */
export function stepIndex(index, step, length) {
  if (length <= 0) return 0;
  return (((index + step) % length) + length) % length;
}

/** "5 / 120" (1-based). @param {number} index @param {number} length */
export function counterLabel(index, length) {
  return `${index + 1} / ${length}`;
}

/**
 * Horizontal swipe → step: -1 (next, finger moved left), 1 (previous), 0 (not a swipe).
 * @param {number} dx  end x minus start x
 * @param {number} dy  end y minus start y
 * @param {number} [threshold]
 */
export function swipeStep(dx, dy, threshold = 48) {
  if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 1.2) return 0;
  return dx < 0 ? 1 : -1;
}
