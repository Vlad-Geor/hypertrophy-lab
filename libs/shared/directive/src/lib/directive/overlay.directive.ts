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
  linkedSignal,
} from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ikiDevOverlay]',
  standalone: true,
})
export class OverlayDirective implements OnDestroy {
  private overlay = inject(Overlay);
  private elementRef = inject(ElementRef);
  private viewContainerRef = inject(ViewContainerRef);

  private _overlayRef: OverlayRef | null = null;

  width = input<number | undefined>(undefined);
  height = input<number | undefined>(undefined);
  inheritDimensions = input<boolean>(false);

  templateRef = input<TemplateRef<any> | null>(null, { alias: 'ikiDevOverlay' });
  _templateRef = linkedSignal(() => this.templateRef());

  overlayAnchor = input<HTMLElement>();

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
      width: this.inheritDimensions()
        ? this.overlayAnchor()?.getBoundingClientRect().width ||
          this.elementRef.nativeElement.getBoundingClientRect().width
        : this.width(),
      height: this.height(),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    };

    this._overlayRef = this.overlay.create(overlayConfig);
    const tplRef = this._templateRef();

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
