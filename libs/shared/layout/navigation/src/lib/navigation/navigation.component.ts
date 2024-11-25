import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ColorThemePipe } from '@ikigaidev/hl/ui/pipe';
import { IconComponent } from '@ikigaidev/icon';
import { IconType } from '@ikigaidev/icon';
import { FabNavItem } from '../model/fab-nav-item.model';
import { createIconItem } from '../util/create-nav-item.util';

@Component({
  selector: 'lib-navigation',
  standalone: true,
  imports: [CommonModule, IconComponent, ColorThemePipe],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  isSelected = false;

  private readonly icons: { icon: IconType; routerLink: string }[] = [
    { icon: 'smart_display', routerLink: '' },
    { icon: 'fitness_center', routerLink: '' },
    { icon: 'ramen_dining', routerLink: '' },
    { icon: 'person', routerLink: '' },
  ];

  navItems: FabNavItem[] = this.icons.map((icon) =>
    createIconItem(icon.icon, icon.routerLink, this.isSelected)
  );
}
