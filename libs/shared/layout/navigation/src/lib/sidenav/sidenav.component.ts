import { CommonModule } from '@angular/common';
import { Component, inject, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { IconButtonComponent, IconComponent } from '@ikigaidev/elements';
import { GLOBAL_OVERLAY_REF, GlobalOverlayRef } from '@ikigaidev/overlay';
import { ViewportService } from '@ikigaidev/service';
import { filter, map, startWith } from 'rxjs';
import { MenuItem } from '../model/menu-item.model';
import { createMenuItems } from '../util/create-menu-items';

@Component({
  selector: 'lib-sidenav',
  standalone: true,
  imports: [CommonModule, IconComponent, RouterModule, IconButtonComponent],
  templateUrl: './sidenav.component.html',
  host: {
    role: 'navigation',
    class: 'flex flex-col bg-surface h-dvh max-w-[302px] border-r border-gray-active',
  },
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  private readonly router = inject(Router);
  readonly vpService = inject(ViewportService);
  readonly overlayRef = inject<GlobalOverlayRef>(GLOBAL_OVERLAY_REF, { optional: true });

  // TBD should be injected, app wide. Differentiates between nutrition and fitness
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
    this.menuItems().find((i) => i.route === this.url()),
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
    // this.selectedItem.set(item);
    // this.updateActiveMenuItem();
  }

  onSettingsClick(): void {
    // Handle settings click
    console.log('Settings clicked');
  }

  onCloseClick(): void {
    if (this.overlayRef) this.overlayRef.close();
  }
}
