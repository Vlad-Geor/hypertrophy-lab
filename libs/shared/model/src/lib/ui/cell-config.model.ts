import { IconType } from './icon-type.model';

export type CellConfig = {
  icon?: IconType;
  displayText: string;
  imageUrl?: string;
  selected?: boolean;
  data?: Record<string, any>;
};
