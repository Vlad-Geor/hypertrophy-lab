import { CommonModule } from '@angular/common';
import { Component, inject, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { IconButtonComponent, IconComponent } from '@ikigaidev/elements';
import { ViewportService } from '@ikigaidev/layout-service';
import { GLOBAL_OVERLAY_REF, GlobalOverlayRef } from '@ikigaidev/overlay';
import { filter, map, startWith } from 'rxjs';
import { createMenuItems } from '../create-menu-items/create-menu-items';
import { MenuItem } from '../model/menu-item.model';
import { HlRoutingDirective } from '@ikigaidev/hl/shared';

@Component({
  selector: 'lib-sidenav',

  imports: [CommonModule, IconComponent, RouterModule, IconButtonComponent, HlRoutingDirective],
  templateUrl: './sidenav.component.html',
  host: {
    role: 'navigation',
    class: 'flex flex-col bg-surface h-dvh max-w-[302px] border-r border-gray-active',
  },
})
export class SidenavComponent {
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);
  readonly vpService = inject(ViewportService);
  readonly overlayRef = inject<GlobalOverlayRef>(GLOBAL_OVERLAY_REF, { optional: true });

  // TBD should be injected, app wide. Differentiates between nutrition and fitness.
  readonly APP_MODE = 'Supplement Management';

  readonly user = toSignal(inject(AuthService).user$);
  readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
  );
  menuItems = signal<MenuItem[]>(createMenuItems());
  selectedItem = linkedSignal<MenuItem | undefined>(() =>
    this.menuItems().find(
      (i) => i.route === this.url() || (this.url() as string).includes(i.route),
    ),
  );
  _menuItems = linkedSignal(() =>
    this.menuItems().map((i) => ({
      ...i,
      isActive: i.route === this.selectedItem()?.route,
    })),
  );

  navigateTo(item: MenuItem): void {
    this.router.navigate([item.route]);
    this.overlayRef?.close();
  }

  onSettingsClick(): void {
    console.log('Settings clicked');
  }

  onCloseClick(): void {
    if (this.overlayRef) this.overlayRef.close();
  }
}
