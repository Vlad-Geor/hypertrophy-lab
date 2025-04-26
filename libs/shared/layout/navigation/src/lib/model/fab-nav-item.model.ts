import { IconType, ThemeColorToken } from '@ikigaidev/model';

export type FabNavItem = {
  icon: IconType;
  iconSize: number;
  iconColor: ThemeColorToken;
  routerLink: string;
};
