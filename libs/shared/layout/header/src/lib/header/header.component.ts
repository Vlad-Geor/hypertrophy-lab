import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IconTextComponent } from '@ikigaidev/elements';

@Component({
  selector: 'lib-header',
  standalone: true,
  imports: [CommonModule, IconTextComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {}
