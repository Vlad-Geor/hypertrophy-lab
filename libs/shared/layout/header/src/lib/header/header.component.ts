import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IconComponent, IconTextComponent } from '@ikigaidev/elements';

@Component({
  selector: 'lib-header',
  standalone: true,
  imports: [CommonModule, IconComponent, IconTextComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {}
