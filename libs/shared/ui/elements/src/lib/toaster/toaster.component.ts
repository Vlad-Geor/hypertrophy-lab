import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, afterNextRender, inject } from '@angular/core';
import { AnimatableOverlayBase, OVERLAY_DATA } from '@ikigaidev/overlay';
import { take, timer } from 'rxjs';
import { IconButtonComponent } from '../button';
import { ButtonComponent } from '../button/button.component';
import { DividerComponent } from '../divider/divider.component';
import { IconComponent } from '../icon/icon.component';
import {
  ToasterOverlayData,
  toasterAppearanceDurations,
  toasterTypeIcons,
} from './toaster.model';

@Component({
  selector: 'lib-toaster',
  templateUrl: './toaster.component.html',
  imports: [
    CommonModule,
    IconComponent,
    ButtonComponent,
    DividerComponent,
    IconButtonComponent,
  ],
  animations: [
    trigger('fadeTranslate', [
      state('animate-in', style({ opacity: 1, transform: 'translateY(0)' })),
      state('animate-out', style({ opacity: 0, transform: 'translateY(100%)' })),

      transition('void => animate-in', [
        style({ opacity: 0, transform: 'translateY(100%)' }),
        animate('250ms cubic-bezier(.2,0,.2,1)'),
      ]),

      transition('animate-in => animate-out', [animate('120ms cubic-bezier(.4,0,1,1)')]),
    ]),
  ],
})
export class ToasterComponent extends AnimatableOverlayBase {
  config = inject<ToasterOverlayData>(OVERLAY_DATA);
  dRef = inject(DestroyRef);

  toasterIconByType = toasterTypeIcons;

  constructor() {
    super();
    afterNextRender(() => {
      const closeDelay = toasterAppearanceDurations[this.config.type ?? 'info'];
      timer(closeDelay)
        .pipe(take(1))
        .subscribe(() => this.globalOverlayRef.close());
    });
  }

  onLinkClicked(): void {
    this.config.onLinkClick?.();
  }

  onButtonClicked(): void {
    this.config.onButtonClick?.();
  }

  onClose(): void {
    // If desired, an object of type <any> can be passed as close data.
    // This data will be emitted on the afterClosed$ observable of the globalOverlayService.
    this.onOverlayClose();
  }
}
