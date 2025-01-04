import { THEME_COLORS } from '@ikigaidev/fixture';
import { NestedKeyOf } from '@ikigaidev/util';

export type ThemeColor = NestedKeyOf<typeof THEME_COLORS>;
