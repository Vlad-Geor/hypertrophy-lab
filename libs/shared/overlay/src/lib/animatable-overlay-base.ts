import { AnimationEvent } from '@angular/animations';
import { inject, signal } from '@angular/core';
import { GlobalOverlayRef } from './global-overlay/global-overlay-ref';
import { GLOBAL_OVERLAY_REF } from './global-overlay/global-overlay.service';

export type AnimationPhase = 'animate-in' | 'visible' | 'animate-out';

export abstract class AnimatableOverlayBase {
  protected globalOverlayRef = inject<GlobalOverlayRef>(GLOBAL_OVERLAY_REF);
  protected animationState = signal<AnimationPhase>('animate-in');

  onAnimateDone(e: AnimationEvent): void {
    if (e.toState === 'animate-out') {
      this.globalOverlayRef.notifyExitAnimationDone();
    }
  }

  onOverlayClose(result?: any): void {
    this.globalOverlayRef.close(result);
  }

  startExitAnimation(): void {
    this.animationState.set('animate-out');
  }
}