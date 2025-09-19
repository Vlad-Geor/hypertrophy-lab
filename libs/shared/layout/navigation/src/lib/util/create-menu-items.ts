import { MenuItem } from '../model/menu-item.model';

export const createMenuItems: () => MenuItem[] = () => [
  {
    icon: 'dashboard-liner',
    label: 'Dashboard',
    route: '/dashboard',
  },
  {
    icon: 'clock-solid',
    label: 'Schedule',
    route: '/dashboard',
  },
  {
    icon: 'list-check-liner',
    label: 'My Routine',
    route: '/dashboard',
    isActive: true,
  },
  {
    icon: 'box-liner',
    label: 'Inventory',
    route: '/supplements',
  },
  {
    icon: 'plus-solid',
    label: 'Add Supplement',
    route: '/dashboard',
  },
  {
    icon: 'cart-liner',
    label: 'Orders',
    route: '/dashboard',
  },
];
