import { NestedKeyOf } from '@ikigaidev/util';
import { THEME_COLORS } from 'libs/shared/ui/fixture/theme-colors';

export type ThemeColor = NestedKeyOf<typeof THEME_COLORS>;
