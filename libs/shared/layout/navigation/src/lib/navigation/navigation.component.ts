import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { IconComponent } from '@ikigaidev/elements';
import { IconType } from '@ikigaidev/model';
import { FabNavItem, NavItemType } from '../model/fab-nav-item.model';

type NavItem = {
  icon: IconType;
  routerLink: string;
};

@Component({
  selector: 'lib-navigation',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  selectedItem = signal<NavItem | null>(null);

  private readonly icons: NavItemType[] = [
    { icon: 'fitness_center',  },
    // { icon: 'ramen_dining', routerLink: '' },
    // { icon: 'person', routerLink: '' },
  ];

  navItems: FabNavItem[] = [];
  // this.icons.map((icon) =>
  //   createIconItem(icon.icon, icon.routerLink),
  // );

  onNavClick(item: FabNavItem | null): void {
    console.log(item);
  }
}
