import { Component, computed, effect, inject, input, linkedSignal } from '@angular/core';
import {
  ButtonComponent,
  IconButtonComponent,
  IconComponent,
  IconTile,
  TagComponent,
} from '@ikigaidev/elements';
import { DayEntrySchema, IntakeStatus } from '@ikigaidev/hl/contracts';
import { ScheduleService } from '../../data-access/schedule.service';

@Component({
  selector: 'hl-intake-action-card',
  templateUrl: './intake-log-card.component.html',
  imports: [IconTile, TagComponent, ButtonComponent, IconComponent, IconButtonComponent],
  providers: [ScheduleService],
  host: {
    class: 'flex flex-col gap-3 bg-surface-2 p-3 pb-4 rounded-lg',
  },
})
export class IntakeLogCard {
  private scheduleService = inject(ScheduleService);

  cardData = input<DayEntrySchema>();

  enableActions = linkedSignal(() => this.cardData()?.status === 'pending');
  inEditMode = computed(
    () => this.enableActions() && this.cardData()?.status !== 'pending',
  );

  constructor() {
    effect(() => console.log(this.cardData()));
  }

  onLogIntake(status: Exclude<IntakeStatus, 'pending'>): void {
    if (this.inEditMode()) {
      this.createIntakeLog(status);
    } else {
      this.updateIntakeLog(status);
    }
  }

  createIntakeLog(status: Exclude<IntakeStatus, 'pending'>): void {
    this.scheduleService
      .logIntake({
        date: new Date().toISOString().slice(0, 10),
        consumeStock: true,
        status: status,
        timeOfDay: this.cardData()?.timeOfDay ?? 'morning',
        userSupplementId: this.cardData()?.userSupplementId ?? '',
        planId: this.cardData()?.planId ?? '',
      })
      .subscribe((v) => this.enableActions.set(v.status !== 'pending' ? true : false));
  }

  updateIntakeLog(status: Exclude<IntakeStatus, 'pending'>): void {
    this.scheduleService.updateIntakeLog(this.cardData()?.logId ?? '', { status });
  }
}
