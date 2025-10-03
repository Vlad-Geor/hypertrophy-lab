import { ListItem } from '@ikigaidev/model';

export interface GenericOptionConfig<T = any> {
  /** Array of dynamic values to iterate over */
  values: T[];
  /** Constant text before the dynamic value */
  prefix?: string;
  /** Constant text after the dynamic value */
  suffix?: string;
  /** Custom formatter for the entire label */
  labelFormatter?: (value: T, index: number, prefix?: string, suffix?: string) => string;
  /** Custom ID generator */
  idGenerator?: (value: T, index: number) => string | number;
  /** Custom value transformer (defaults to using the value as-is) */
  valueTransformer?: (value: T, index: number) => any;
  /** Separator between prefix and dynamic content (default: ' ') */
  prefixSeparator?: string;
  /** Separator between dynamic content and suffix (default: ' ') */
  suffixSeparator?: string;
}

export function generateGenericOptions<T = any>(
  config: GenericOptionConfig<T>,
): ListItem<undefined>[] {
  const {
    values,
    prefix = '',
    suffix = '',
    labelFormatter,
    idGenerator,
    valueTransformer,
    prefixSeparator = ' ',
    suffixSeparator = ' ',
  } = config;

  return values.map((value, index) => {
    // Generate label
    const label = labelFormatter
      ? labelFormatter(value, index, prefix, suffix)
      : [prefix, value, suffix]
          .filter((part) => part !== '')
          .join(
            prefix && value ? prefixSeparator : suffix && value ? suffixSeparator : '',
          );

    // Generate ID
    const id = idGenerator ? idGenerator(value, index) : `option-${index}`;

    // Transform value if needed
    const transformedValue = valueTransformer ? valueTransformer(value, index) : value;

    return {
      displayText: label,
      //   id,
      //   label,
      value: transformedValue,
    } as ListItem<undefined>;
  });
}

export function generateUnitOptionsWithPrefix(quantity: number): ListItem<undefined>[] {
  return generateGenericOptions({
    values: range(1, quantity),
    labelFormatter: (val) => `${val} ${val === 1 ? 'unit' : 'units'}`,
  });
}

export function range(start: number, end: number, step = 1): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
}

export function generateUnitOptions(quantity: number): ListItem<undefined>[] {
  return generateGenericOptions({
    values: range(1, quantity),
    labelFormatter: (val) => `${val} ${val === 1 ? 'unit' : 'units'}`,
  });
}

export function createSelectOptions(): any {
  return null;
}
