import { DatePipe, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  BouncingLoaderComponent,
  ButtonComponent,
  DateRangePicker,
  IconComponent,
  Pill,
  TagComponent,
} from '@ikigaidev/elements';
import { Daypart, NoData } from '@ikigaidev/hl/shared';
import { SurfaceCard } from '@ikigaidev/hl/ui';
import { GlobalOverlay } from '@ikigaidev/overlay';
import { AddRoutine } from '../add-routine/add-routine.component';
import { ScheduleService } from '../data-access/schedule.service';
import { DayPartOverview } from '../ui/day-part-overview/day-part-overview.component';
import { IntakeLogCard } from '../ui/intake-log-card/intake-log-card.component';
import { dayPartFilters } from './day-section-pills';

@Component({
  selector: 'hl-schedule',
  imports: [
    IconComponent,
    TitleCasePipe,
    ButtonComponent,
    DatePipe,
    Pill,
    NoData,
    SurfaceCard,
    TitleCasePipe,
    IntakeLogCard,
    DayPartOverview,
    TagComponent,
    DateRangePicker,
    BouncingLoaderComponent,
  ],
  providers: [ScheduleService],
  templateUrl: './schedule.component.html',
  host: {
    class: 'flex flex-col gap-4',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Schedule {
  private scheduleService = inject(ScheduleService);
  private readonly globalOverlay = inject(GlobalOverlay);

  today = new Date();
  todayFormatted = signal(this.today.toISOString().slice(0, 10));
  selectedDaypartFilter = signal<Daypart | null>(null);

  pillData = dayPartFilters;

  dayOverview = this.scheduleService.getDayOverview(this.todayFormatted());
  hasAnyData = computed(() =>
    this.dayOverview.value()?.sections.some((s) => s.items.length),
  );
  filteredOverview = computed(() => {
    const ov = this.dayOverview.value();
    if (ov)
      return {
        ...ov,
        sections: this.selectedDaypartFilter()
          ? Array.of(
              ov.sections.find((s) => {
                return s.timeOfDay === this.selectedDaypartFilter();
              }),
            )
          : ov.sections,
      };
    return undefined;
  });

  onDaypartFilter(dayPart: Daypart): void {
    this.selectedDaypartFilter.set(dayPart);
  }

  addRoutine(): void {
    this.globalOverlay.openComponent(AddRoutine, {
      overlayConfig: { hasBackdrop: true, backdropClass: 'bg-black/80' },
    });
  }
}
