import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ColorThemePipe } from '@ikigaidev/hl/ui/pipe';
import { IconComponent } from '@ikigaidev/icon';

@Component({
  selector: 'lib-navigation',
  standalone: true,
  imports: [CommonModule, IconComponent, ColorThemePipe],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  isSelected = true;
}
