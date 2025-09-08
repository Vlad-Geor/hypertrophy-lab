import { ConnectedPosition } from '@angular/cdk/overlay';

export type PositionAxisY = 'center' | 'downwards' | 'upwards';
export type PositionAxisX =
  | 'center'
  | 'protrude-left'
  | 'protrude-right'
  | 'align-right'
  | 'align-left';

export const DEFAULT_OFFSET = 8;

const OVERLAY_POSITION_TOP: Record<PositionAxisX, ConnectedPosition> = {
  center: {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
    offsetY: -DEFAULT_OFFSET,
  },
  'align-right': {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetY: -DEFAULT_OFFSET,
  },
  'align-left': {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetY: -DEFAULT_OFFSET,
  },
  'protrude-right': {
    originX: 'end',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetY: -DEFAULT_OFFSET,
  },
  'protrude-left': {
    originX: 'start',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetY: -DEFAULT_OFFSET,
  },
};

const OVERLAY_POSITION_RIGHT: Record<PositionAxisY, ConnectedPosition> = {
  center: {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetX: DEFAULT_OFFSET,
  },
  downwards: {
    originX: 'end',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'top',
    offsetX: DEFAULT_OFFSET,
  },
  upwards: {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetX: DEFAULT_OFFSET,
  },
};

const OVERLAY_POSITION_LEFT: Record<PositionAxisY, ConnectedPosition> = {
  center: {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    offsetX: -DEFAULT_OFFSET,
  },
  downwards: {
    originX: 'start',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top',
    offsetX: -DEFAULT_OFFSET,
  },
  upwards: {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetX: -DEFAULT_OFFSET,
  },
};

const OVERLAY_POSITION_BOTTOM: Record<PositionAxisX, ConnectedPosition> = {
  center: {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    offsetY: DEFAULT_OFFSET,
  },
  'align-left': {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    offsetY: DEFAULT_OFFSET,
  },
  'align-right': {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    offsetY: DEFAULT_OFFSET,
  },
  'protrude-right': {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetY: DEFAULT_OFFSET,
  },
  'protrude-left': {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
    offsetY: DEFAULT_OFFSET,
  },
};

export const OVERLAY_POSITIONS = {
  right: OVERLAY_POSITION_RIGHT,
  top: OVERLAY_POSITION_TOP,
  bottom: OVERLAY_POSITION_BOTTOM,
  left: OVERLAY_POSITION_LEFT,
} as const;

export type OverlayDirection = keyof typeof OVERLAY_POSITIONS;

export const DEFAULT_POSITIONS: ConnectedPosition[] = [
  ...getPositionsFor('right'),
  ...getPositionsFor('bottom'),
  ...getPositionsFor('left'),
  ...getPositionsFor('top'),
] as const;

type PositionMap = typeof OVERLAY_POSITIONS;
export type Dir = keyof PositionMap; // 'top' | 'right' | 'bottom' | 'left'
type PosName<D extends Dir> = keyof PositionMap[D]; // e.g. 'center' | 'protrude-left' | …
export type OverlayPositionKey = {
  [D in Dir]: `${D & string}.${PosName<D> & string}`;
}[Dir];

export function getPositionsFor<D extends OverlayDirection>(dir: D): ConnectedPosition[] {
  return Object.values(OVERLAY_POSITIONS[dir]);
}
