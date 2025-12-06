import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { CreatePlanRequest, CreatePlanResponse } from '@ikigaidev/hl/contracts';
import {
  ExistingSuppItemData,
  ExistingSupplementItem,
  GroupsService,
  SupplementService,
} from '@ikigaidev/hl/supplements';
import { ListItem } from '@ikigaidev/model';
import { GLOBAL_OVERLAY_REF, GlobalOverlayRef } from '@ikigaidev/overlay';
import { debounceTime, Observable } from 'rxjs';
import { ScheduleService } from '../data-access/schedule.service';
import { DaysGroup } from '../model/create-routine-form.model';
import { DAY_KEYS, DAY_NUM } from '../model/weekdays.model';

type AddRoutineForm = {
  days: FormGroup<DaysGroup>;
  timeOfDay: FormControl<TimeOfDay | null>;
  unitsPerDose: FormControl<number | null>;
  userSupplementId: FormControl<string | null>;
  notes: FormControl<string | null>;
};

type RoutineInventoryMeta = {
  inventorySource: 'personal' | 'group';
  userSupplementId?: string;
  groupId?: string | null;
  groupSupplementId?: string | null;
  groupName?: string | null;
};

type RoutineSelectItem = ListItem<string, ExistingSuppItemData & RoutineInventoryMeta>;

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
  providers: [ScheduleService, GroupsService],
  host: {
    class:
      'max-w-[320px] md:max-w-md bg-surface p-3 pl-4 flex flex-col gap-4 rounded-2xl border border-gray-active shadow-2xl',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddRoutine {
  private readonly suppService = inject(SupplementService);
  private readonly groupsService = inject(GroupsService);
  private readonly scheduleService = inject(ScheduleService);
  private readonly fb = inject(FormBuilder);
  protected globalOverlayRef = inject<GlobalOverlayRef>(GLOBAL_OVERLAY_REF, {
    optional: true,
  });
  existingSuppComponent = ExistingSupplementItem;

  DAYS = DAY_KEYS;
  timeOfDayOptions = signal<ListItem<TimeOfDay>[]>([
    { displayText: 'Morning', value: 'morning' },
    { displayText: 'Afternoon', value: 'afternoon' },
    { displayText: 'Evening', value: 'evening' },
    { displayText: 'Bedtime', value: 'bedtime' },
  ]);
  noPlanSupplements = this.suppService.userSupplements(true);
  noPlanGroupSupplements = this.groupsService.userGroupSupplements(true);

  addRoutineOptions = computed<RoutineSelectItem[] | undefined>(() => {
    const personal = this.noPlanSupplements.value()?.items ?? [];
    const groupSupplements = this.noPlanGroupSupplements.value() ?? [];

    const personalItems: RoutineSelectItem[] = personal.map((d) => ({
      data: {
        id: d.id,
        images: d.images,
        name: d.catalogName ?? '',
        form: d.form,
        servingUnits: Number(d.servingUnits),
        unitsPerContainer: d.unitsPerContainer,
        inventorySource: 'personal',
        userSupplementId: d.id,
      },
      displayText: d.catalogName ?? '',
      value: `personal:${d.id}`,
    }));

    const groupItems: RoutineSelectItem[] = groupSupplements.map((item) => {
      const displayName =
        item.nickname ?? item.catalogName ?? item.groupName ?? 'Group supplement';
      return {
        data: {
          id: item.id,
          images: item.images ?? [],
          name: displayName,
          form: null,
          servingUnits: Number(item.servingUnits ?? 0),
          unitsPerContainer: Number(item.onHandUnits ?? 0),
          inventorySource: 'group',
          groupId: item.groupId,
          groupSupplementId: item.id,
          groupName: item.groupName ?? null,
        },
        displayText: `${displayName}${item.groupName ? ` (${item.groupName})` : ''}`,
        value: `group:${item.id}`,
      };
    });

    return [...personalItems, ...groupItems];
  });

  readonly form = this.fb.group<AddRoutineForm>({
    days: this.fb.group<DaysGroup>(
      {
        sun: this.fb.nonNullable.control(true),
        mon: this.fb.nonNullable.control(true),
        tue: this.fb.nonNullable.control(true),
        wed: this.fb.nonNullable.control(true),
        thu: this.fb.nonNullable.control(true),
        fri: this.fb.nonNullable.control(true),
        sat: this.fb.nonNullable.control(true),
      },
      { validators: [Validators.required] },
    ),
    timeOfDay: this.fb.control<TimeOfDay>('morning'),
    unitsPerDose: this.fb.control(null, Validators.required),
    userSupplementId: this.fb.control(null, Validators.required),
    notes: this.fb.control(null),
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
    const selectionValue = userSupplementId ?? '';
    const selected = this.addRoutineOptions()?.find(
      (item) => item.value === selectionValue,
    )?.data;
    if (!selected) throw new Error('Please select a supplement to schedule');

    const baseRequest = {
      daysOfWeek: this.daysToArray(),
      timeOfDay: timeOfDay ?? 'morning',
      unitsPerDose: Number(unitsPerDose),
      notes,
    };

    if (selected.inventorySource === 'group') {
      return {
        ...baseRequest,
        inventorySource: 'group',
        groupId: selected.groupId ?? '',
        groupSupplementId: selected.groupSupplementId ?? '',
      };
    }

    return {
      ...baseRequest,
      inventorySource: 'personal',
      userSupplementId: selected.userSupplementId ?? '',
    };
  }

  onClose(): void {
    if (this.globalOverlayRef) this.globalOverlayRef.close();
  }

  onSubmit = (): Observable<CreatePlanResponse> => {
    const req = this.toCreatePlanRequest();
    return this.scheduleService.addUserSupplementPlan(req);
  };

  onSubmitSuccess(e: unknown): void {
    this.globalOverlayRef?.close();
  }
}
