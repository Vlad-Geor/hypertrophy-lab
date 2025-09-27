import { IconType } from '@ikigaidev/model';

export type Daypart = 'morning' | 'afternoon' | 'evening' | 'night';

export type DayPartPill = { text: Daypart; icon: IconType; iconClass: string };

export const dayPartFilters: DayPartPill[] = [
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
