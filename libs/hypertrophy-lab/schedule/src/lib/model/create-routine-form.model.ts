import { FormControl } from "@angular/forms";
import { TimeOfDay } from "@ikigaidev/contracts";

export type DaysGroup = {
  sun: FormControl<boolean>;
  mon: FormControl<boolean>;
  tue: FormControl<boolean>;
  wed: FormControl<boolean>;
  thu: FormControl<boolean>;
  fri: FormControl<boolean>;
  sat: FormControl<boolean>;
};

export type CreatePlanForm = {
  daysOfWeek: FormControl<number[]>;
  timeOfDay: FormControl<TimeOfDay>;
  unitsPerDose: FormControl<number>;
  userSupplementId: FormControl<string>;
  notes: FormControl<string>;
};
