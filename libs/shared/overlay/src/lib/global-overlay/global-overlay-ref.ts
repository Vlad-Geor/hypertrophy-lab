import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentRef, effect, Injector, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, Observable, pairwise } from 'rxjs';

export type OverlayDisplayPhase = 'open' | 'exiting' | 'disposed';

export class GlobalOverlayRef<R = unknown> {
  private _phase = signal<OverlayDisplayPhase | undefined>(undefined);
  private _result = signal<R | undefined>(undefined);
  readonly detachments$: Observable<void>;
  private _cmp: ComponentRef<any> | undefined;

  readonly beforeClosed$!: Observable<R | undefined>;

  readonly afterClosed$!: Observable<R | undefined>;

  constructor(
    private readonly overlayRef: OverlayRef,
    private readonly injector: Injector,
  ) {
    effect(
      () => {
        if (this._phase() === 'disposed') {
          if (this.overlayRef.hasAttached()) {
            this.overlayRef.detach();
          }
          this.overlayRef.dispose();
        }
      },
      { injector: this.injector },
    );
    this.detachments$ = this.overlayRef.detachments();
    this.beforeClosed$ = toObservable(this._phase, { injector: this.injector }).pipe(
      pairwise(),
      filter(([prev, curr]) => prev !== 'exiting' && curr === 'exiting'),
      map(() => this._result()),
    );
    this.afterClosed$ = toObservable(this._phase, { injector: this.injector }).pipe(
      filter((p) => p === 'disposed'),
      map(() => this._result()),
    );
  }

  attachComponentRef(cmp: ComponentRef<any>): void {
    this._cmp = cmp;
    this._phase.set('open');
  }

  close(result?: R): void {
    if (this._phase() === 'exiting' || this._phase() === 'disposed') return;
    this._result.set(result);

    const instance = this._cmp?.instance as any;
    if (typeof instance?.startExitAnimation === 'function') {
      this._phase.set('exiting');
      instance.startExitAnimation();
    } else {
      this._phase.set('disposed');
    }
  }

  notifyExitAnimationDone(): void {
    if (this._phase() === 'exiting') {
      this._phase.set('disposed');
    }
  }
}
