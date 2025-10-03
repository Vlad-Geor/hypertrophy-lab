import { CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, inject, isDevMode, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InputComponent } from '@ikigaidev/elements';
import { HeaderComponent } from '@ikigaidev/header';
import { SidenavComponent } from '@ikigaidev/navigation';
import { ViewportService } from '@ikigaidev/service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'hl-shell',
  imports: [
    CommonModule,
    RouterOutlet,
    InputComponent,
    HeaderComponent,
    SidenavComponent,
    CdkDragPlaceholder,
  ],
  templateUrl: './shell.component.html',
  host: {
    class: 'relative flex min-h-dvh',
    '[class.pt-10]': 'devMode() && !vpService.isFullView',
  },
})
export class Shell {
  readonly vpService = inject(ViewportService);
  readonly devMode = signal(isDevMode());
}
