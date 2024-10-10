import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IconComponent } from '@ikigaidev/icon';
import { ColorThemePipe } from '@ikigaidev/pipe';

@Component({
  selector: 'lib-navigation',
  standalone: true,
  imports: [CommonModule, IconComponent, ColorThemePipe],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  isSelected = true;
}
