import { IconType } from './icon-type.model';

// export type ListItem<T, V = undefined> = {
//   id?: string;
//   icon?: IconType;
//   displayText: string;
//   imageUrl?: string;
//   value?: T;
// } & (V extends undefined ? { data?: never } : { data: V });

export type ListItem<V = unknown, D = undefined> = {
  id?: string;
  icon?: IconType;
  displayText: string;
  imageUrl?: string;
  value: V;
} & (D extends undefined ? { data?: never } : { data: D });
