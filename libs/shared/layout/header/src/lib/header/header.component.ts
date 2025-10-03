import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  IconButtonComponent,
  IconComponent,
  InputComponent,
  StatefulIconComponent,
} from '@ikigaidev/elements';
import { SidenavComponent } from '@ikigaidev/navigation';
import { GlobalOverlay } from '@ikigaidev/overlay';
import { RouterMetaService } from '@ikigaidev/router';
import { ViewportService } from '@ikigaidev/service';

@Component({
  selector: 'lib-header',
  imports: [
    CommonModule,
    IconComponent,
    IconButtonComponent,
    StatefulIconComponent,
    InputComponent,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly overlay = inject(GlobalOverlay);
  readonly vpService = inject(ViewportService);
  readonly routerService = inject(RouterMetaService);
  // readonly notifService; -> TBD

  toggleSidebar(): void {
    this.overlay.openComponent(SidenavComponent, {
      position: { left: 0, top: 0 },
      overlayConfig: {
        hasBackdrop: true,
      },
    });
  }
}
