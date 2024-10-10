import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IconComponent } from '@ikigaidev/icon';
import { IconTextComponent } from '@ikigaidev/icon-text';

@Component({
  selector: 'lib-header',
  standalone: true,
  imports: [CommonModule, IconComponent, IconTextComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {}
