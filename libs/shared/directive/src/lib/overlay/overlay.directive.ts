import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  inject,
  input,
} from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ikiConnectedOverlay]',
  standalone: true,
})
export class ConnectedOverlayDirective implements OnDestroy {
  private overlay = inject(Overlay);
  private elementRef = inject(ElementRef);
  private viewContainerRef = inject(ViewContainerRef);

  private _overlayRef: OverlayRef | null = null;

  width = input<number | undefined>(undefined);
  height = input<number | undefined>(undefined);
  inheritDimensions = input<boolean>(false);

  templateRef = input<TemplateRef<any> | null>(null, { alias: 'ikiConnectedOverlay' });

  overlayAnchor = input<ElementRef>();

  @HostListener('click')
  openOverlay(): void {
    if (this._overlayRef) {
      this.closeOverlay();
      return;
    }

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.overlayAnchor() || this.elementRef.nativeElement)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
        },
      ]);

    const overlayConfig: OverlayConfig = {
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    };

    this._overlayRef = this.overlay.create(overlayConfig);
    const tplRef = this.templateRef();

    if (tplRef) {
      this._overlayRef.attach(new TemplatePortal(tplRef, this.viewContainerRef));

      this._overlayRef.backdropClick().subscribe(() => {
        this.closeOverlay();
      });
    }
  }

  ngOnDestroy() {
    this.closeOverlay();
  }

  closeOverlay() {
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }
}
