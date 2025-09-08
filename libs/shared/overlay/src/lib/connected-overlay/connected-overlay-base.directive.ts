import { AnimationEvent } from '@angular/animations';
import { Directive, output } from '@angular/core';

@Directive()
export abstract class ConnectedOverlayBase {
  readonly closed = output<void>();

  abstract onAnimationDone(e: AnimationEvent): void;
}
