import { CommonModule, JsonPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import {
  ButtonComponent,
  IconComponent,
  IconTile,
  options,
  Progressbar,
  SurfaceCard,
  TagComponent,
} from '@ikigaidev/elements';
import { IconType, Theme } from '@ikigaidev/model';
import { DashboardService } from '../data-access/dashboard.service';
import { SummaryCard } from '../statistics/summary-card/summary-card.component';

type RouteButton = {
  label: string;
  icon: IconType;
  redirectUrl: string;
  theme?: Theme;
  disabled?: boolean;
};

@Component({
  selector: 'hl-dashboard',
  imports: [
    CommonModule,
    Progressbar,
    SummaryCard,
    SurfaceCard,
    IconTile,
    TagComponent,
    ButtonComponent,
    IconComponent,
    RouterLinkWithHref,
    JsonPipe,
  ],
  templateUrl: './dashboard.component.html',
  host: {
    class: 'flex flex-col gap-6',
  },
})
export class Dashboard {
  readonly dashboardService = inject(DashboardService);
  options = options;
  readonly base = this.dashboardService.dashboardDetails;
  readonly summary = this.dashboardService.dashboardDetails.value;
  readonly counters = computed(() => this.summary()?.counters);
  readonly latestOrders = computed(() => this.summary()?.latestOrders);
  readonly recentlyAdded = computed(() => this.summary()?.recentlyAdded);
  readonly lowStockAlerts = computed(() => this.summary()?.lowStockAlerts);
  readonly expiringSoon = computed(() => this.summary()?.expiringSoonItems);

  quickActions: RouteButton[] = [
    {
      label: 'Add Supplement',
      icon: 'plus-solid',
      theme: 'gradient-primary',
      redirectUrl: '/new-supplement',
    },
    {
      label: 'View Schedule',
      icon: 'clock-solid',
      redirectUrl: '/schedule',
    },
    {
      label: 'View Inventory',
      icon: 'box-liner',
      redirectUrl: '/supplements/inventory',
    },
    {
      label: 'Track Orders',
      icon: 'cart-liner',
      redirectUrl: '/schedule',
      disabled: true
    },
  ];
}
