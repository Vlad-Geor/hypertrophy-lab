import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent, DateRangePicker, IconComponent, IconTile, Pill, TagComponent } from '@ikigaidev/elements';
import { SurfaceCard } from '@ikigaidev/hl/ui';
import { IconType } from '@ikigaidev/model';
import { DayPartOverview } from '../ui/day-part-overview/day-part-overview.component';
import { IntakeLogCard } from '../ui/intake-log-card/intake-log-card.component';

export type Daypart = 'morning' | 'afternoon' | 'evening' | 'night';

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
    DateRangePicker
],
  templateUrl: './schedule.html',
  host: {
    class: 'flex flex-col gap-4',
  },
})
export class Schedule {
  today = new Date();

  pillData: { text: Daypart; icon: IconType; iconClass: string }[] = [
    {
      text: 'morning',
      icon: 'sunrise-liner',
      iconClass: 'text-orange-400',
    },
    {
      text: 'afternoon',
      icon: 'sun-liner',
      iconClass: 'text-secondary',
    },
    {
      text: 'evening',
      icon: 'sunset-liner',
      iconClass: 'text-accent-purple',
    },
    {
      text: 'night',
      icon: 'moon-liner',
      iconClass: 'text-blue-400',
    },
  ];
}
