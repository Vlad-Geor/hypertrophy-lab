import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'firstWord' })
export class FirstWordPipe implements PipeTransform {
  transform(value: unknown): string {
    const s = (value ?? '').toString().trim();
    if (!s) return '';
    const i = s.search(/\s/);
    return i === -1 ? s : s.slice(0, i);
  }
}
