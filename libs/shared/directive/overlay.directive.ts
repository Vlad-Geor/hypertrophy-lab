import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  inject,
  input,
} from '@angular/core';

@Directive({
  selector: '[ikiDevOverlay]',
  standalone: true,
})
export class OverlayDirective implements OnInit, OnDestroy {
  private overlay = inject(Overlay);
  private elementRef = inject(ElementRef);
  private viewContainerRef = inject(ViewContainerRef);

  templateRef = input<TemplateRef<any> | null>(null, { alias: 'ikiDevOverlay' });
  triggerElement = input<HTMLElement>();
  width = input<string | undefined>(undefined);
  height = input<string | undefined>(undefined);

  private overlayRef?: OverlayRef;

  ngOnInit() {
    const trigger = this.triggerElement() || this.elementRef.nativeElement;
    trigger.addEventListener('click', this.openPopup.bind(this));
  }

  ngOnDestroy() {
    this.closePopup();
    const trigger = this.triggerElement() || this.elementRef.nativeElement;
    trigger.removeEventListener('click', this.openPopup.bind(this));
  }

  openPopup() {
    if (this.overlayRef) {
      this.closePopup();
      return;
    }

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.triggerElement() || this.elementRef.nativeElement)
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
      width: this.width(),
      height: this.height(),
    };

    this.overlayRef = this.overlay.create(overlayConfig);
    const tplRef = this.templateRef();

    if (tplRef) {
      const portal = new TemplatePortal(tplRef, this.viewContainerRef);
      this.overlayRef.attach(portal);

      this.overlayRef.backdropClick().subscribe(() => {
        this.closePopup();
      });
    }
  }

  closePopup() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }
}
