import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  Injectable,
  InjectionToken,
  Injector,
  Provider,
  TemplateRef,
  Type,
  ViewContainerRef,
  inject,
  signal,
} from '@angular/core';
import {
  attachBackdropClose,
  attachCloseHandlers,
  attachEscClose,
} from '../util/overlay-utils';
import { GlobalOverlayRef } from './global-overlay-ref';
import { OverlayPosition, buildPosition } from './global-overlay.util.js';

export const OVERLAY_DATA = new InjectionToken<any>('OVERLAY_DATA');
export const OVERLAY_INPUTS = new InjectionToken<Record<string, any>>('OVERLAY_INPUTS');
export const OVERLAY_TEMPLATES = new InjectionToken<Record<string, TemplateRef<any>>>(
  'OVERLAY_TEMPLATES',
);
export const OVERLAY_REF = new InjectionToken<OverlayRef>('OVERLAY_REF');
export const GLOBAL_OVERLAY_REF = new InjectionToken<GlobalOverlayRef>(
  'GLOBAL_OVERLAY_REF',
);

@Injectable({providedIn: 'root'})
export class GlobalOverlay {
  private readonly overlay = inject(Overlay);
  private readonly injector = inject(Injector);

  private _cmp = signal<ComponentRef<any> | undefined>(undefined);

  withOverlayRef: (overlayRef: OverlayRef) => Provider = (overlay) => ({
    provide: OVERLAY_REF,
    useFactory: () => overlay,
  });

  openTemplate(
    templateRef: TemplateRef<any>,
    config: {
      position?: OverlayPosition;
      hasBackdrop?: boolean;
      backdropClass?: string;
    } = {},
  ): OverlayRef {
    const positionStrategy = buildPosition(this.overlay, config.position);

    const overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: config.hasBackdrop ?? true,
      backdropClass: config.backdropClass ?? 'cdk-overlay-dark-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.block(),
      disposeOnNavigation: true,
    });

    overlayRef.attach(
      new TemplatePortal(templateRef, null as unknown as ViewContainerRef),
    );

    attachCloseHandlers(overlayRef);
    return overlayRef;
  }

  openComponent<T, THandle = unknown>(
    component: Type<T>,
    config: {
      overlayConfig?: OverlayConfig;
      position?: OverlayPosition;
      disableBackdropClick?: boolean;
      data?: Record<string, any>;
    } = {},
    handler?: { token: InjectionToken<THandle>; value: THandle },
  ): GlobalOverlayRef {
    const positionStrategy = buildPosition(this.overlay, config.position);

    const overlayRef = this.overlay.create({
      ...config.overlayConfig,
      positionStrategy,
      disposeOnNavigation: true,
    });

    const globalRef = new GlobalOverlayRef(overlayRef, this.injector);

    const providers: Provider[] = [
      { provide: OVERLAY_DATA, useValue: config.data || {} },
      { provide: GLOBAL_OVERLAY_REF, useValue: globalRef },
      this.withOverlayRef(overlayRef),
    ];

    if (handler) {
      providers.push({
        provide: handler.token,
        useValue: handler.value,
      });
    }

    const injector = Injector.create({
      parent: this.injector,
      providers,
    });
    const cmpRef: ComponentRef<any> = overlayRef.attach(
      new ComponentPortal(component, null, injector),
    );

    globalRef.attachComponentRef(cmpRef);
    this._cmp.set(cmpRef);

    if (!config.disableBackdropClick) {
      attachBackdropClose(overlayRef);
    }
    attachEscClose(overlayRef, globalRef);

    return globalRef;
  }
}
