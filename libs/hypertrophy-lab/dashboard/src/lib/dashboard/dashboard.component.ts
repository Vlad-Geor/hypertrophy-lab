import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginComponent} from '@ikigaidev/login'

@Component({
  selector: 'hl-dashboard',
  imports: [CommonModule, LoginComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
