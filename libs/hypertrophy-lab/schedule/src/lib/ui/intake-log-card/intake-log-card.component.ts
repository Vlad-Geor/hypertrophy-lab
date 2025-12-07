import { HttpErrorResponse } from '@angular/common/http';
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
  openToaster,
  TagComponent,
} from '@ikigaidev/elements';
import { CreateLogResponse, DayEntrySchema, IntakeStatus } from '@ikigaidev/hl/contracts';
import { GlobalOverlay } from '@ikigaidev/overlay';
import { finalize, Observable } from 'rxjs';
import { ScheduleService } from '../../data-access/schedule.service';
import {
  intakeLogErrorToasterConfig,
  intakeLogSuccessToasterConfig,
} from './open-status-toaster.util';

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
  private overlay = inject(GlobalOverlay);

  cardData = input<DayEntrySchema>();
  updatedLog = linkedSignal<Partial<DayEntrySchema>>(() => ({ ...this.cardData() }));
  inEditMode = signal(false);
  showActions = linkedSignal(
    () => this.updatedLog()?.status === 'pending' || this.inEditMode(),
  );

  logTaken = (): Observable<CreateLogResponse> => this.updateIntakeLog('taken');
  logSkipped = (): Observable<CreateLogResponse> => this.updateIntakeLog('skipped');

  constructor() {
    effect(() => console.log(this.cardData()));
  }

  onLogSkipped(ev: unknown): void {
    openToaster(
      this.overlay,
      intakeLogSuccessToasterConfig('skipped', this.cardData()?.name ?? ''),
    );
    this.showActions.set(false);
    this.updatedLog.set({ ...(ev as Partial<DayEntrySchema>) });
  }

  onLogError(ev: HttpErrorResponse): void {
    openToaster(
      this.overlay,
      intakeLogErrorToasterConfig(this.cardData()?.name ?? '', ev),
    );
  }

  onLogTaken(ev: unknown) {
    openToaster(
      this.overlay,
      intakeLogSuccessToasterConfig('taken', this.cardData()?.name ?? ''),
    );
    this.showActions.set(false);
    this.updatedLog.set({ ...(ev as Partial<DayEntrySchema>) });
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
        inventorySource: this.cardData()?.inventorySource ?? 'personal',
      })
      .pipe(finalize(() => this.inEditMode.set(false)))
      .subscribe((res) => {
        this.showActions.set(false);
        this.updatedLog.set({ ...res, userSupplementId: res.userSupplementId ?? '' });
      });
  }

  updateIntakeLog(
    status: Exclude<IntakeStatus, 'pending'>,
  ): Observable<CreateLogResponse> {
    return this.scheduleService
      .updateIntakeLog(this.cardData()?.logId ?? '', { status })
      .pipe(finalize(() => this.inEditMode.set(false)));
  }
}
