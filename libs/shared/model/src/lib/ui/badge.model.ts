import { Size } from './size.model';
import { ThemeColorToken } from './theme-color.model';

export type BadgeConfig = {
  value: string | number;
  color: ThemeColorToken;
  size: Size;
};
