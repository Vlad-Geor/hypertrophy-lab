import {
  ConnectedOverlayPositionChange,
  ConnectedPosition,
  OverlayRef,
} from '@angular/cdk/overlay';
import { GlobalOverlayRef } from '../global-overlay/global-overlay-ref';
import { OverlayChevronClass } from '../model/chevron-class.model';

export function removeOverlayClass(overlayRef: OverlayRef, className: string): void {
  overlayRef.overlayElement.classList.toggle(className, false);
}

export function addOverlayClass(overlayRef: OverlayRef, className: string): void {
  overlayRef.overlayElement.classList.toggle(className, true);
}

export function chevronPositionBasedClass(
  pos: ConnectedOverlayPositionChange,
): OverlayChevronClass | undefined {
  const p = pos.connectionPair;

  if (p.originX === 'end') {
    return 'chevron-left';
  } else if (p.originX === 'start') {
    return 'chevron-right';
  }

  if (p.originY === 'top') {
    return 'chevron-bottom';
  } else if (p.originY === 'bottom') {
    return 'chevron-top';
  }
  return undefined;
}

export function updatePositionOffsets(
  positions: ConnectedPosition[],
  inputOffsets: { offsetX?: number; offsetY?: number },
) {
  const { offsetX, offsetY } = inputOffsets;

  if (!offsetX && !offsetY) return positions;

  const pos = positions.map((pos) => ({
    ...pos,
    ...(offsetX !== undefined ? { offsetX } : {}),
    ...(offsetY !== undefined ? { offsetY } : {}),
  }));
  return pos;
}

export function openOverlayContains(
  target: Node | null,
  openOverlay: OverlayRef | null,
): boolean | null {
  if (openOverlay) return target != null && openOverlay?.overlayElement?.contains(target);
  return null;
}

export function anyOpenOverlayContains(
  target: Node | null,
  openOverlays: OverlayRef[],
): boolean {
  return (
    target != null && openOverlays.some((ref) => ref.overlayElement.contains(target))
  );
}

export function attachEscClose(
  overlayRef: OverlayRef,
  globalOverlayRef?: GlobalOverlayRef,
): void {
  overlayRef.keydownEvents().subscribe((e) => {
    if (e.key === 'Escape') {
      if (globalOverlayRef) {
        globalOverlayRef.close();
      } else {
        overlayRef.dispose();
      }
    }
  });
}

export function attachBackdropClose(
  overlayRef: OverlayRef,
  globalOverlayRef?: GlobalOverlayRef,
) {
  overlayRef
    .backdropClick()
    .subscribe(() =>
      globalOverlayRef ? globalOverlayRef.close() : overlayRef.dispose(),
    );
}

export function attachCloseHandlers(
  overlayRef: OverlayRef,
  globalOverlayRef?: GlobalOverlayRef,
): void {
  attachBackdropClose(overlayRef, globalOverlayRef);
  attachEscClose(overlayRef, globalOverlayRef);
}
