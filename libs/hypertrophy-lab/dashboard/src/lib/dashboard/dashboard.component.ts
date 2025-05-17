import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginComponent } from '@ikigaidev/login';

@Component({
  selector: 'hl-dashboard',
  imports: [CommonModule, LoginComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    console.log(this.route.routeConfig?.data?.['loginSuccess']);
  }
}
