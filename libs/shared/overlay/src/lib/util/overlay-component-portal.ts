import { OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  inject,
  Injector,
  Provider,
  runInInjectionContext,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { ConnectedOverlayDirective } from '../connected-overlay/connected-overlay.directive';

export function useOverlayComponentPortal<T>(
  component: Type<T> | null,
  providers: Provider[],
  injector: Injector,
  overlayConfiguration?: OverlayConfig,
): ConnectedOverlayDirective | undefined {
  let overlayDirectiveRef: ConnectedOverlayDirective | undefined;
  runInInjectionContext(injector, () => {
    const overlayDirective = inject(ConnectedOverlayDirective);
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

    const componentPortal = new ComponentPortal(
      component,
      viewContainerRef,
      portalInjector,
    );

    overlayDirective._componentPortal.set(componentPortal);

    if (overlayConfiguration) {
      overlayDirective._overlayConfig.set(overlayConfiguration);
    }

    overlayDirectiveRef = overlayDirective;
  });
  return overlayDirectiveRef;
}
