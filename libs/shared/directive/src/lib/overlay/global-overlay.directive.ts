import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  Directive,
  InjectionToken,
  Injector,
  Provider,
  Type,
  ViewContainerRef,
  inject,
  output,
} from '@angular/core';

const OVERLAY_DATA = new InjectionToken<any>('OVERLAY_DATA');

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[globalOverlay]',
})
export class GlobalOverlayDirective {
  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);
  private readonly injector = inject(Injector);

  overlayClosed = output<void>();

  private overlayRef: OverlayRef | null = null;

  open(
    component: Type<any>,
    componentProviders?: Provider[],
    data?: Record<string, any>,
    config?: OverlayConfig,
  ) {
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        backdropClass: 'cdk-overlay-transparent-backdrop',
        positionStrategy: this.overlay
          .position()
          .global()
          .centerHorizontally()
          .centerVertically(),
        ...config,
      });

      this.overlayRef.backdropClick().subscribe(() => this.close());
    }

    const componentInjector = Injector.create({
      parent: this.injector,
      providers:
        (componentProviders || []).length > 0
          ? [...(componentProviders || []), { provide: OVERLAY_DATA, useValue: data }]
          : [],
    });

    const portal = new ComponentPortal(component, this.vcr, componentInjector);
    this.overlayRef.attach(portal);
  }

  close() {
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.overlayClosed.emit();
  }
}
