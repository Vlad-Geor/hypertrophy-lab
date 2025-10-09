import { IconType } from './icon-type.model';

export type ListItem<T = undefined> = {
  id?: string;
  icon?: IconType;
  displayText: string;
  imageUrl?: string;
  value?: T;
} & (T extends undefined ? { data?: never } : { data: T });
