import { IconType, ThemeColorToken } from '@ikigaidev/model';

export type NavItemType = 'inventory' | 'workouts' | 'settings' | 'nutrition';

export type FabNavItem = {
  icon: IconType;
  routerLink: string;
  navType: NavItemType;
  iconSize?: number;
  iconColor?: ThemeColorToken;
};
