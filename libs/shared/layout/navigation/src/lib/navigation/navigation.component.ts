import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconComponent } from '@ikigaidev/elements';
import { NavItem } from '../model/fab-nav-item.model';
import { createIconItem } from '../util/create-nav-item.util';

@Component({
  selector: 'lib-navigation',
  standalone: true,
  imports: [CommonModule, IconComponent, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  selectedItem = signal<NavItem | null>(null);

  private readonly icons: NavItem[] = [
    { icon: 'pill-fill', link: 'all-supplements', navType: 'settings' },
    { icon: 'bookmark-solid', link: '', navType: 'workouts' },
    { icon: 'bag-shopping-solid', link: 'inventory', navType: 'nutrition' },
    { icon: 'person-rays-solid', link: '', navType: 'settings' },
  ];

  navItems: NavItem[] = this.icons.map((icon) =>
    createIconItem(icon.icon, icon.link, icon.navType),
  );

  onNavClick(item: NavItem | null): void {
    console.log(item);
  }
}
