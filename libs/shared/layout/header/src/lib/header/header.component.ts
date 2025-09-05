import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  IconButtonComponent,
  IconComponent,
  StatefulIconComponent,
} from '@ikigaidev/elements';

@Component({
  selector: 'lib-header',
  standalone: true,
  imports: [CommonModule, IconComponent, IconButtonComponent, StatefulIconComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {}
