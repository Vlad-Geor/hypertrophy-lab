import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@ikigaidev/header';
import { NavigationComponent } from '@ikigaidev/navigation';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'hl-dashboard-shell',
  imports: [CommonModule, NavigationComponent, HeaderComponent, RouterOutlet],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class DashboardShellComponent {}
