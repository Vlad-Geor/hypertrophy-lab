import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginPage } from '@ikigaidev/hl/login';
import { SidenavComponent } from '@ikigaidev/navigation';
import { options, SelectComponent } from "@ikigaidev/elements";

@Component({
  selector: 'hl-dashboard',
  imports: [CommonModule, LoginPage, SidenavComponent, SelectComponent],
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
