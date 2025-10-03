import { InputSignal, OutputEmitterRef } from '@angular/core';
import { ListItem, Size } from '@ikigaidev/model';

export interface CustomListItemComponent<T> {
  data: InputSignal<T | undefined>; // This T matches ListItem<T>['data']
  listItem?: InputSignal<ListItem<T> | undefined>; // Optional: full access to the ListItem
  selected?: InputSignal<boolean | undefined>;
  size?: InputSignal<Extract<Size, 'sm' | 'md' | 'lg'> | undefined>;
  itemClicked?: OutputEmitterRef<ListItem<T> | undefined>;
}
