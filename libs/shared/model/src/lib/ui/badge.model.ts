import { Size } from './size.model';
import { ThemeColor } from './theme-color.model';

export type BadgeConfig = {
  value: string | number;
  color: ThemeColor;
  size: Size;
};
