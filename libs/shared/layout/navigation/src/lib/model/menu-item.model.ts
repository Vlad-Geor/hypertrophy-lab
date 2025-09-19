import { IconType } from '@ikigaidev/model';

export type MenuItem = {
  icon: IconType;
  label: string;
  route: string;
  isActive?: boolean;
};
