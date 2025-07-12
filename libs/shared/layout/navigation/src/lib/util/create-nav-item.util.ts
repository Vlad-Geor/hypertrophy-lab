import { IconType } from '@ikigaidev/model';
import { FabNavItem, NavItemType } from '../model/fab-nav-item.model';

export const createIconItem = (
  icon: IconType,
  routerLink: string,
  navType: NavItemType,
): FabNavItem => ({
  icon,
  routerLink,
  iconSize: 36,
  navType,
  iconColor: 'white',
});
