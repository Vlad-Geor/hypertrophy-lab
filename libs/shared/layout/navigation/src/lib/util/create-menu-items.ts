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
    route: '/schedule',
  },
  {
    icon: 'list-check-liner',
    label: 'My Routine',
    route: '/routine',
    isActive: true,
  },
  {
    icon: 'box-liner',
    label: 'Supplements',
    route: '/supplements',
  },
  {
    icon: 'plus-solid',
    label: 'Add Supplement',
    route: '/new-supplement',
  },
  {
    icon: 'cart-liner',
    label: 'Orders',
    route: '/orders',
  },
];
