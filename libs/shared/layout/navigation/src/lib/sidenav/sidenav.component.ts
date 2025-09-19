import { CommonModule } from '@angular/common';
import { afterNextRender, Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IconButtonComponent, IconComponent } from '@ikigaidev/elements';
import { User } from '@ikigaidev/model';
import { MenuItem } from '../model/menu-item.model';
import { createMenuItems } from '../util/create-menu-items';

@Component({
  selector: 'lib-sidenav',
  standalone: true,
  imports: [CommonModule, IconComponent, RouterModule, IconButtonComponent],
  templateUrl: './sidenav.component.html',
  host: {
    role: 'navigation',
    class: 'flex flex-col bg-surface h-full max-w-[302px]',
  },
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  private readonly router = inject(Router);
  // TBD should be injected, app wide. Differentiates between nutrition and fitness
  readonly APP_MODE = 'Supplement Management';

  selectedItem = signal<MenuItem | null>(null);
  user = signal<User>({
    id: 123123,
    displayName: 'Vlad Geor',
  });
  menuItems = signal<MenuItem[]>(createMenuItems());

  constructor() {
    afterNextRender({
      read: () => this.updateActiveMenuItem(),
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.updateActiveMenuItem();
  }

  private updateActiveMenuItem(): void {
    const currentRoute = this.router.url;
    this.menuItems().forEach((item) => {
      item.isActive = item.route === currentRoute;
    });
  }

  onSettingsClick(): void {
    // Handle settings click
    console.log('Settings clicked');
  }

  onCloseClick(): void {
    // Handle close/collapse sidenav
    console.log('Close clicked');
  }
}
