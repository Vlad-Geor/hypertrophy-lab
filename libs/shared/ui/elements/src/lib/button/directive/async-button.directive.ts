import {
  Directive,
  HostBinding,
  HostListener,
  input,
  output,
  signal,
} from '@angular/core';
import { from, Observable } from 'rxjs';

@Directive({ selector: '[libAsyncClick]' })
export class AsyncButton<T extends Observable<unknown>> {
  readonly asyncClick = input<() => T>();
  public readonly processing = signal<boolean>(false);

  @HostBinding('attr.disabled') disabled = false;

  next = output<unknown>();
  btnError = output<unknown>();
  complete = output<void>();

  @HostListener('click')
  handle() {
    const inputCallback = this.asyncClick()?.();
    if (!inputCallback || this.processing()) return;
    this.processing.set(true);
    this.disabled = true;
    from(inputCallback)
      //   .pipe(delay(50000))
      .subscribe({
        next: (v) => this.next.emit(v),
        error: (err) => {
          this.processing.set(false);
          this.disabled = false;
          this.btnError.emit(err);
        },
        complete: () => {
          this.processing.set(false);
          this.disabled = false;
          this.complete.emit();
        },
      });
  }
}
