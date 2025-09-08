import { OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { inject, Injector, Provider, runInInjectionContext, Type, ViewContainerRef } from '@angular/core';
import { RangeConnectedOverlayDirective } from '../connected-overlay/connected-overlay.directive';

export function useOverlayComponentPortal<T>(
  component: Type<T> | null,
  providers: Provider[],
  injector: Injector,
  overlayConfiguration?: OverlayConfig
): RangeConnectedOverlayDirective | undefined {
  let overlayDirectiveRef: RangeConnectedOverlayDirective | undefined;
  runInInjectionContext(injector, () => {
    const overlayDirective = inject(RangeConnectedOverlayDirective);
    const viewContainerRef = inject(ViewContainerRef);
    const parentInjector = inject(Injector);

    if (!component) {
      overlayDirective._componentPortal.set(null);
      return;
    }

    const portalInjector = Injector.create({
      providers: providers,
      parent: parentInjector,
    });

    const componentPortal = new ComponentPortal(component, viewContainerRef, portalInjector);

    overlayDirective._componentPortal.set(componentPortal);

    if (overlayConfiguration) {
      overlayDirective._overlayConfig.set(overlayConfiguration);
    }

    overlayDirectiveRef = overlayDirective;
  });
  return overlayDirectiveRef;
}