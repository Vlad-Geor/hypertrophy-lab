// import { THEME_COLORS } from '@ikigaidev/fixture';

// type NestedKeys<T> = {
//   [K in keyof T & string]: T[K] extends string
//     ? K
//     : T[K] extends object
//       ? K | `${K}.${NestedKeys<T[K]>}`
//       : never;
// }[keyof T & string];

// function flatten<T extends Record<string, any>>(
//   obj: T,
//   prefix = '',
// ): Record<string, string> {
//   return Object.entries(obj).reduce(
//     (acc, [key, val]) => {
//       const newKey = prefix ? `${prefix}.${key}` : key;
//       if (typeof val === 'string') {
//         acc[newKey] = val;
//       } else {
//         Object.assign(acc, flatten(val as any, newKey));
//       }
//       return acc;
//     },ThemeColoredComponent
//     {} as Record<string, string>,
//   );
// }

// export const colorTokenMap = flatten(THEME_COLORS);
// export type ThemeColorToken = keyof typeof colorTokenMap;

// export type CssColorFor = 'color' | 'background-color' | 'border-color';

// export type ThemeColorToken = NestedKeys<typeof THEME_COLORS>;
