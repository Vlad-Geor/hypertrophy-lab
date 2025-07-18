import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconComponent } from '@ikigaidev/elements';
import { IconType } from '@ikigaidev/model';
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
    { icon: 'fitness_center' as IconType, link: '', navType: 'workouts' },
    { icon: 'ramen_dining', link: '', navType: 'nutrition' },
    { icon: 'person', link: '', navType: 'settings' },
  ];

  navItems: NavItem[] = this.icons.map((icon) =>
    createIconItem(icon.icon, icon.link, icon.navType),
  );

  onNavClick(item: NavItem | null): void {
    console.log(item);
  }
}
