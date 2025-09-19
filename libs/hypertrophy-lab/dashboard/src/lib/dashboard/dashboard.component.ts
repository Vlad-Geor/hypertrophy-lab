import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginPageComponent } from '@ikigaidev/hl/login';
import { SidenavComponent } from '@ikigaidev/navigation';

@Component({
  selector: 'hl-dashboard',
  imports: [CommonModule, LoginPageComponent, SidenavComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    console.log('hell');
  }
}
