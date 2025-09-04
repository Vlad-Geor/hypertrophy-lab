import { IconType } from '@ikigaidev/model';

export type NavItemType = 'inventory' | 'workouts' | 'settings' | 'nutrition';

export type NavItem = {
  icon: IconType;
  link: string;
  navType: NavItemType;
  iconSize?: number;
  iconColor?: any;
};
