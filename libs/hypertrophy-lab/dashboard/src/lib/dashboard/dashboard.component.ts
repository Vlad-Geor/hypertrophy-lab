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
import { CurrencyService } from '@ikigaidev/service';
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
  private readonly currencyService = inject(CurrencyService);

  options = options;
  readonly base = this.dashboardService.dashboardDetails;
  readonly summaryValue = this.base.value;
  readonly counters = computed(() => this.summaryValue()?.counters);
  readonly latestOrders = computed(() => this.summaryValue()?.latestOrders);
  readonly recentlyAdded = computed(() => this.summaryValue()?.recentlyAdded);
  readonly lowStockAlerts = computed(() => this.summaryValue()?.lowStockAlerts);
  readonly expiringSoon = computed(() => this.summaryValue()?.expiringSoonItems);
  readonly totalCostDollars = computed(() =>
    Math.round((this.summaryValue()?.totalMonthlyCostCents ?? 0) / 100),
  );
  readonly totalCostIls = computed(() =>
    this.currencyService.usdToIls(this.totalCostDollars()),
  );

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
      disabled: true,
    },
  ];
}
