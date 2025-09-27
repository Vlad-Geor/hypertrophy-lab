import { DatePipe, TitleCasePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  BouncingLoaderComponent,
  ButtonComponent,
  DateRangePicker,
  IconComponent,
  Pill,
  TagComponent,
} from '@ikigaidev/elements';
import { API_BASE_URL, DayScheduleResponse } from '@ikigaidev/hl/shared';
import { SurfaceCard } from '@ikigaidev/hl/ui';
import { DayPartOverview } from '../ui/day-part-overview/day-part-overview.component';
import { IntakeLogCard } from '../ui/intake-log-card/intake-log-card.component';
import { dayPartFilters } from './day-section-pills';

@Component({
  selector: 'hl-schedule',
  imports: [
    IconComponent,
    ButtonComponent,
    DatePipe,
    Pill,
    SurfaceCard,
    TitleCasePipe,
    IntakeLogCard,
    DayPartOverview,
    TagComponent,
    DateRangePicker,
    BouncingLoaderComponent,
  ],
  templateUrl: './schedule.html',
  host: {
    class: 'flex flex-col gap-4',
  },
})
export class Schedule {
  private readonly API_BASE = inject(API_BASE_URL);

  today = new Date();
  todayFormatted = signal(new Date().toISOString().slice(0, 10));

  pillData = dayPartFilters;

  dayOverview = httpResource<DayScheduleResponse>(
    () => `${this.API_BASE}/schedule?date=${this.todayFormatted()}`,
  );
}
