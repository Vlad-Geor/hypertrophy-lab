import { InjectionToken, Signal } from '@angular/core';

export type OverlayState = 'visible' | 'hidden';
export const OVERLAY_STATE = new InjectionToken<Signal<OverlayState>>('OVERLAY_STATE');