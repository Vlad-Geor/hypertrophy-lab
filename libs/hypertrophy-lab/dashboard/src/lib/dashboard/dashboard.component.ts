import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginPageComponent } from '@ikigaidev/hl/login';

@Component({
  selector: 'hl-dashboard',
  imports: [CommonModule, LoginPageComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    // throw new Error('Not Implemented');
  }
}
