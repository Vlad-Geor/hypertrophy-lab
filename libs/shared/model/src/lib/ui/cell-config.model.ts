import { IconType } from './icon-type.model';

export type ListItem<T = undefined> = {
  id?: string;
  icon?: IconType;
  displayText: string;
  imageUrl?: string;
  value?: T;
} & (T extends undefined ? { data?: never } : { data: T });

// export type ListItem<V = unknown, D = undefined> = {
//   id?: string;
//   icon?: IconType;
//   displayText: string;
//   imageUrl?: string;
//   value?: V;
// } & (D extends undefined ? { data?: never } : { data: D });
