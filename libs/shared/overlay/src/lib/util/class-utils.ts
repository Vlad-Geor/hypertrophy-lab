import { OverlayRef } from '@angular/cdk/overlay';

export function removeOverlayClass(overlayRef: OverlayRef, className: string): void {
  overlayRef.overlayElement.classList.toggle(className, false);
}

export function addOverlayClass(overlayRef: OverlayRef, className: string): void {
  overlayRef.overlayElement.classList.toggle(className, true);
}