import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import {
  ButtonComponent,
  IconButtonComponent,
  IconComponent,
  IconTile,
  TagComponent,
} from '@ikigaidev/elements';
import { DayEntrySchema, IntakeStatus } from '@ikigaidev/hl/contracts';
import { finalize } from 'rxjs';
import { ScheduleService } from '../../data-access/schedule.service';

@Component({
  selector: 'hl-intake-action-card',
  templateUrl: './intake-log-card.component.html',
  imports: [IconTile, TagComponent, ButtonComponent, IconComponent, IconButtonComponent],
  providers: [ScheduleService],
  host: {
    class: 'flex flex-col gap-3 bg-surface-2 p-3 pb-4 rounded-lg',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntakeLogCard {
  private scheduleService = inject(ScheduleService);

  cardData = input<DayEntrySchema>();
  updatedLog = linkedSignal<Partial<DayEntrySchema>>(() => ({ ...this.cardData() }));
  inEditMode = signal(false);
  showActions = linkedSignal(
    () => this.updatedLog()?.status === 'pending' || this.inEditMode(),
  );

  constructor() {
    effect(() => console.log(this.cardData()));
  }

  onLogIntake(status: Exclude<IntakeStatus, 'pending'>): void {
    // if (!this.inEditMode()) {
    //   this.createIntakeLog(status);
    // } else {
    this.updateIntakeLog(status);
    // }
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
      .pipe(finalize(() => this.inEditMode.set(false)))
      .subscribe((res) => {
        this.showActions.set(false);
        this.updatedLog.set({ ...res });
      });
  }

  updateIntakeLog(status: Exclude<IntakeStatus, 'pending'>): void {
    this.scheduleService
      .updateIntakeLog(this.cardData()?.logId ?? '', { status })
      .pipe(finalize(() => this.inEditMode.set(false)))
      .subscribe((res) => {
        this.showActions.set(false);
        this.updatedLog.set({ ...res });
      });
  }
}
