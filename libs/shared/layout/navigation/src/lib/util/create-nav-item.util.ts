import { IconType } from '@ikigaidev/model';
import { NavItem, NavItemType } from '../model/fab-nav-item.model';

export const createIconItem = (
  icon: IconType,
  routerLink: string,
  navType: NavItemType,
): NavItem => ({
  icon,
  link: routerLink,
  iconSize: 36,
  navType,
  iconColor: 'white',
});
