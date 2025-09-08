import { Overlay } from '@angular/cdk/overlay';

export type OverlayPosition = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export function buildPosition(overlay: Overlay, position?: OverlayPosition) {
  const strategy = overlay.position().global();
  if (!position?.left && !position?.right) {
    strategy.centerHorizontally();
  } else {
    if (position?.left != null) {
      strategy.left(`${position.left}px`);
    }
    if (position.right != null) {
      strategy.right(`${position.right}px`);
    }
  }

  if (!position?.top && !position?.bottom) {
    strategy.centerVertically();
  } else {
    if (position?.top != null) {
      strategy.top(`${position.top}px`);
    }
    if (position?.bottom != null) {
      strategy.bottom(`${position.bottom}px`);
    }
  }
  return strategy;
}
