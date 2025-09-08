import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Point } from '@angular/cdk/drag-drop';
import {
  ConnectedOverlayPositionChange,
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  TemplateRef,
  ViewContainerRef,
  computed,
  forwardRef,
  inject,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { DirectiveCompositionConfig } from '../model/directive-composition.model';
import { OverlayOperationMode } from '../model/overlay-operation-mode.model';
import { DEFAULT_POSITIONS, OverlayPositionKey } from '../model/overlay-position.model';
import {
  addOverlayClass,
  chevronPositionBasedClass,
  openOverlayContains,
  updatePositionOffsets,
} from '../util/overlay-utils';
import { coercePositionKey } from './util/coerce-position';

export const OVERLAY_HOST_DEFAULTS: DirectiveCompositionConfig = {
  directive: forwardRef(() => RangeConnectedOverlayDirective),
  inputs: [
    'overlayPosition',
    'overlayOffsetX',
    'overlayOffsetY',
    'anchorRef',
    'overlayMode',
    'overlayTheme',
    'overlayConfig',
    'hideChevron',
    'delayClose',
  ],
  outputs: ['overlayClosed'],
};

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[rangeOverlay]',
})
export class RangeConnectedOverlayDirective {
  overlay = inject(Overlay);
  triggerElementRef = inject(ElementRef);
  viewContainerRef = inject(ViewContainerRef);

  private static activeOverlay: OverlayRef | null;

  overlayMode = input<OverlayOperationMode | null>('hover');
  overlayTheme = input<'dark' | 'light'>('light');
  hideChevron = input<boolean>(false);
  delayClose = input<boolean>(true);

  templateRef = input<TemplateRef<any> | null>(null, { alias: 'rangeOverlay' });
  anchorRef = input<ElementRef | undefined>(undefined);
  overlayPosition = input<ConnectedPosition, OverlayPositionKey>(undefined, {
    transform: coercePositionKey,
  });
  overlayConfig = input<OverlayConfig>();
  _overlayConfig = linkedSignal(() => this.overlayConfig());
  overlayOffsetX = input<number | undefined, string>(undefined, {
    transform: coerceNumberProperty,
  });
  overlayOffsetY = input<number, string | number>(undefined, {
    transform: coerceNumberProperty,
  });
  _mode = linkedSignal(() => this.overlayMode());
  _theme = linkedSignal(() => this.overlayTheme());
  _hideChevron = linkedSignal(() => this.hideChevron());
  _overlayPosition = linkedSignal(() => this.overlayPosition());
  _delayClose = linkedSignal(() => this.delayClose());

  originEntrypoint = signal<(Point & { width: number; height: number }) | null>(null);
  _componentPortal = signal<ComponentPortal<unknown> | null>(null);
  _componentRef = signal<ComponentRef<any> | undefined>(undefined);

  positions = computed<ConnectedPosition[]>(() => {
    const m = this._mode();
    if (m) {
      return m === 'mouseOrigin'
        ? [
            {
              originX: 'start',
              originY: 'bottom',
              overlayX: 'start',
              overlayY: 'top',
              offsetY: 16,
            },
          ]
        : (this._overlayPosition() ?? ({} as ConnectedPosition))
          ? [this._overlayPosition() ?? ({} as ConnectedPosition), ...DEFAULT_POSITIONS]
          : [...DEFAULT_POSITIONS];
    }
    return [];
  });

  flexiblePositionStrategy = computed<FlexibleConnectedPositionStrategy>(() =>
    this.overlay
      .position()
      .flexibleConnectedTo(
        this._mode() === 'mouseOrigin'
          ? (this.originEntrypoint() ??
              ({} as Point & {
                width: number;
                height: number;
              }))
          : this.anchorRef() || this.triggerElementRef,
      )
      .withPositions(
        updatePositionOffsets(this.positions(), {
          offsetX: this.overlayOffsetX(),
          offsetY: this.overlayOffsetY(),
        }),
      ),
  );

  componentAttached = output<ComponentRef<any>>();
  overlayClosed = output<void>();

  private hideTimer!: ReturnType<typeof setTimeout>;
  private _overlayRef!: OverlayRef | null;

  private _open(): OverlayRef | undefined {
    if (!this.templateRef() && !this._componentPortal()) {
      return;
    }

    if (RangeConnectedOverlayDirective.activeOverlay?.hasAttached()) {
      RangeConnectedOverlayDirective.activeOverlay.detach();
      RangeConnectedOverlayDirective.activeOverlay = null;
    }

    if (!this._overlayRef) {
      this._overlayRef = this.overlay.create({
        positionStrategy: this.flexiblePositionStrategy(),
        scrollStrategy: this.overlay.scrollStrategies.close(),
        panelClass: 'range-overlay',
        disposeOnNavigation: true,
        hasBackdrop: false,
        ...this._overlayConfig(),
      });
    } else if (this._mode() === 'mouseOrigin') {
      this._overlayRef.updatePositionStrategy(this.flexiblePositionStrategy());
    }

    this._overlayRef.detachments().subscribe(() => {
      if (RangeConnectedOverlayDirective.activeOverlay === this._overlayRef) {
        RangeConnectedOverlayDirective.activeOverlay = null;
      }
    });

    if (!this._overlayRef.hasAttached()) {
      const tplRef = this.templateRef();
      if (tplRef) {
        const portal = this.templateRef()
          ? new TemplatePortal(tplRef, this.viewContainerRef)
          : this._componentPortal();
        const ref: ComponentRef<unknown> = this._overlayRef.attach(portal);
        this._componentRef.set(ref);
        this.componentAttached.emit(ref);
      }
    }

    this._overlayRef.overlayElement.addEventListener('mouseenter', () => {
      clearTimeout(this.hideTimer);
    });

    this._overlayRef.overlayElement.addEventListener('mouseleave', (ev: MouseEvent) => {
      if (this._mode() !== 'hover' && this._mode() !== 'mouseOrigin') return;
      if (!this.triggerElementRef.nativeElement.contains(ev.relatedTarget as Node)) {
        this.handleClose();
      }
    });

    this.flexiblePositionStrategy().positionChanges.subscribe(
      (pos: ConnectedOverlayPositionChange) => {
        if (this._overlayRef) {
          addOverlayClass(this._overlayRef, chevronPositionBasedClass(pos) ?? '');
          this._overlayRef.overlayElement.style.setProperty(
            '--range-overlay-theme',
            this._hideChevron()
              ? 'transparent'
              : `var(${this._theme() === 'dark' ? '--color-layers-01-PERMA-DARK' : '--color-layers-02'})`,
          );
        }
        // const triggerRect = this.triggerElementRef.nativeElement.getBoundingClientRect();
        // TBD use for calculated heights
        // const chevronY = (triggerRect.height - 12) / 2;
        // const chevronX = (triggerRect.width - 12) / 2;
        // this.overlayElement.nativeElement.style.setProperty('--chevron-top', `${chevronTop}px`);
      },
    );

    this._overlayRef.keydownEvents().subscribe((event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.close();
      }
    });

    this._overlayRef.backdropClick().subscribe(() => this.close());

    RangeConnectedOverlayDirective.activeOverlay = this._overlayRef;
    return this._overlayRef;
  }

  public open(): OverlayRef | undefined {
    if (this._mode() !== 'code') {
      throw Error('Overlay.open() requires mode to be set to "code".');
    }
    return this._open();
  }

  @HostListener('mouseenter', ['$event'])
  onTriggerMouseEnter(ev: MouseEvent) {
    if (this._mode() !== 'hover' && this._mode() !== 'mouseOrigin') return;

    if (this._mode() === 'mouseOrigin') {
      this.originEntrypoint.set({ x: ev.clientX, y: ev.clientY, width: 0, height: 0 });
    }

    this._open();
  }

  @HostListener('click')
  onTriggerClick() {
    if (this._mode() !== 'click') {
      return;
    }
    this._open();
  }

  @HostListener('mouseleave', ['$event'])
  onTriggerMouseLeave(event: MouseEvent) {
    if (this._mode() !== 'hover' && this._mode() !== 'mouseOrigin') return;

    if (
      !openOverlayContains(
        event.relatedTarget as Node,
        RangeConnectedOverlayDirective.activeOverlay,
      )
    ) {
      this.handleClose();
    }
  }

  private handleClose() {
    if (this._delayClose()) {
      this.hideTimer = setTimeout(() => this.close(), 200);
    } else {
      this.close();
    }
  }

  close(): void {
    if (this._overlayRef?.hasAttached()) {
      this._overlayRef.detach();
      if (RangeConnectedOverlayDirective.activeOverlay === this._overlayRef) {
        RangeConnectedOverlayDirective.activeOverlay = null;
      }
    }
    this.overlayClosed.emit();
  }
}
