import { Overlay } from '@angular/cdk/overlay';

export type OverlayPosition = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export function buildPosition(overlay: Overlay, position?: OverlayPosition) {
  const strategy = overlay.position().global();
  if (position?.left === undefined && position?.right === undefined) {
    strategy.centerHorizontally();
  } else {
    if (position?.left != null) {
      strategy.left(`${position.left}px`);
    }
    if (position.right != null) {
      strategy.right(`${position.right}px`);
    }
  }

  if (position?.top === undefined && position?.bottom === undefined) {
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
