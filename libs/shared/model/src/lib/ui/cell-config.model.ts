import { IconType } from './icon-type.model';

export type CellConfig = {
  id?: string;
  icon?: IconType;
  displayText: string;
  imageUrl?: string;
  data?: Record<string, any>;
};
