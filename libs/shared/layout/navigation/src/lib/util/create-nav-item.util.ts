import { IconType } from '@ikigaidev/icon';
import { FabNavItem } from '../model/fab-nav-item.model';

export const createIconItem = (
  icon: IconType,
  routerLink: string,
  isSelected: boolean
): FabNavItem => ({
  icon,
  routerLink,
  iconSize: 36,
  iconColor: isSelected ? 'white' : 'gray.disabled',
});
