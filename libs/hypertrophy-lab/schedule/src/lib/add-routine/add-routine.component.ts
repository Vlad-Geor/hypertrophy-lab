import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TimeOfDay } from '@ikigaidev/contracts';
import {
  ButtonComponent,
  Checkbox,
  IconButtonComponent,
  IconComponent,
  InputComponent,
  SingleSelectComponent,
  TextareaComponent,
} from '@ikigaidev/elements';
import { CreatePlanRequest } from '@ikigaidev/hl/contracts';
import {
  ExistingSuppItemData,
  ExistingSupplementItem,
  SupplementService,
} from '@ikigaidev/hl/supplements';
import { ListItem } from '@ikigaidev/model';
import { GLOBAL_OVERLAY_REF, GlobalOverlayRef } from '@ikigaidev/overlay';
import { debounceTime, filter, map } from 'rxjs';
import { ScheduleService } from '../data-access/schedule.service';
import { DaysGroup } from '../model/create-routine-form.model';
import { DAY_KEYS, DAY_NUM } from '../model/weekdays.model';

type AddRoutineForm = {
  days: FormGroup<DaysGroup>;
  timeOfDay: FormControl<TimeOfDay>;
  unitsPerDose: FormControl<number>;
  userSupplementId: FormControl<string>;
  notes: FormControl<string>;
};

@Component({
  selector: 'hl-add-routine',
  templateUrl: './add-routine.component.html',
  imports: [
    IconComponent,
    ButtonComponent,
    IconButtonComponent,
    Checkbox,
    InputComponent,
    ReactiveFormsModule,
    SingleSelectComponent,
    TextareaComponent,
    TitleCasePipe,
  ],
  providers: [ScheduleService],
  host: {
    class:
      'max-w-[320px] md:max-w-md bg-surface p-3 pl-4 flex flex-col gap-4 rounded-2xl border border-gray-active shadow-2xl',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddRoutine {
  private readonly suppService = inject(SupplementService);
  private readonly scheduleService = inject(ScheduleService);
  private readonly fb = inject(FormBuilder);
  protected globalOverlayRef = inject<GlobalOverlayRef>(GLOBAL_OVERLAY_REF, {
    optional: true,
  });
  existingSuppComponent = ExistingSupplementItem;

  DAYS = DAY_KEYS;
  timeOfDayOptions = signal<ListItem<TimeOfDay>[]>([
    { displayText: 'morning', value: 'morning' },
    { displayText: 'afternoon', value: 'afternoon' },
    { displayText: 'evening', value: 'evening' },
    { displayText: 'bedtime', value: 'bedtime' },
  ]);
  noPlanSupplements = this.suppService.userSupplements(true);
  // addRoutineOptions = signal([]);
  addRoutineOptions = toSignal(
    toObservable(this.noPlanSupplements.value).pipe(
      filter(Boolean),
      map(
        (response) =>
          response?.items.map((d) => ({
            data: {
              id: d.id,
              images: d.images,
              name: d.catalogName,
              form: d.form,
              servingUnits: Number(d.servingUnits),
              unitsPerContainer: d.unitsPerContainer,
            },
            displayText: d.catalogName,
            value: d.id,
          })) as ListItem<string, ExistingSuppItemData>[] | undefined,
      ),
    ),
  );

  readonly form = this.fb.group<AddRoutineForm>({
    days: this.fb.group<DaysGroup>({
      sun: this.fb.nonNullable.control(true),
      mon: this.fb.nonNullable.control(true),
      tue: this.fb.nonNullable.control(true),
      wed: this.fb.nonNullable.control(true),
      thu: this.fb.nonNullable.control(true),
      fri: this.fb.nonNullable.control(true),
      sat: this.fb.nonNullable.control(true),
    }),
    timeOfDay: this.fb.nonNullable.control<TimeOfDay>('morning'),
    unitsPerDose: this.fb.nonNullable.control(0),
    userSupplementId: this.fb.nonNullable.control(''),
    notes: this.fb.nonNullable.control(''),
  });

  constructor() {
    this.form.valueChanges.pipe(debounceTime(200)).subscribe(console.log);
  }

  private daysToArray(): number[] {
    const v = this.form.controls.days.getRawValue();
    return DAY_KEYS.filter((k) => v[k]).map((k) => DAY_NUM[k] - 1);
  }

  // submit mapping to DTO
  toCreatePlanRequest(): CreatePlanRequest {
    const { timeOfDay, unitsPerDose, userSupplementId, notes } = this.form.getRawValue();
    return {
      daysOfWeek: this.daysToArray(),
      timeOfDay,
      unitsPerDose: Number(unitsPerDose),
      userSupplementId,
      notes,
    };
  }

  onClose(): void {
    if (this.globalOverlayRef) this.globalOverlayRef.close();
  }

  onSubmit(): void {
    const req = this.toCreatePlanRequest();
    this.scheduleService.addUserSupplementPlan(req).subscribe((v) => console.log(v));
  }
}
