import { Daypart } from '@ikigaidev/hl/model';
import { IconType } from '@ikigaidev/model';

export type DayPartPill = { daypart: Daypart; icon: IconType; iconClass: string };

export const dayPartFilters: DayPartPill[] = [
  {
    daypart: 'morning',
    icon: 'sunrise-liner',
    iconClass: 'text-orange-400',
  },
  {
    daypart: 'afternoon',
    icon: 'sun-liner',
    iconClass: 'text-secondary',
  },
  {
    daypart: 'evening',
    icon: 'sunset-liner',
    iconClass: 'text-accent-purple',
  },
  {
    daypart: 'night',
    icon: 'moon-liner',
    iconClass: 'text-blue-400',
  },
];
