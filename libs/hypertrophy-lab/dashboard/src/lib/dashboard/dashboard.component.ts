import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { options, SingleSelectComponent } from '@ikigaidev/elements';
import { LoginPage } from '@ikigaidev/hl/login';
import { SidenavComponent } from '@ikigaidev/navigation';

@Component({
  selector: 'hl-dashboard',
  imports: [CommonModule, LoginPage, SidenavComponent, SingleSelectComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class Dashboard implements OnInit {
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    console.log('hell');
  }

  options = options;
}
