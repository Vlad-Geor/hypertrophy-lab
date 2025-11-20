import { TitleCasePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'titlecaseArray' })
export class TitlecaseArrayPipe implements PipeTransform {
  private tc = new TitleCasePipe();
  transform<T extends string>(values: readonly T[] | null | undefined): string[] {
    if (!values?.length) return [];
    return values.map((v) => this.tc.transform(v ?? ''));
  }
}
