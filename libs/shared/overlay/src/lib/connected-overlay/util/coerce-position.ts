import { ConnectedPosition } from '@angular/cdk/overlay';
import {
  Dir,
  OVERLAY_POSITIONS,
  OverlayPositionKey,
  PositionAxisX,
  PositionAxisY,
} from '../../model/overlay-position.model';

export function coercePositionKey(position: OverlayPositionKey): ConnectedPosition {
  const [dir, raw] = position.split('.') as [Dir, string];

  if (dir === 'left' || dir === 'right') {
    const map = OVERLAY_POSITIONS[dir] as Record<PositionAxisY, ConnectedPosition>;
    const pos = map[raw as PositionAxisY];
    if (!pos) throw new Error(`Invalid overlayPositionKey: ${position}`);
    return pos;
  } else {
    // 'top' | 'bottom'
    const map = OVERLAY_POSITIONS[dir] as Record<PositionAxisX, ConnectedPosition>;
    const pos = map[raw as PositionAxisX];
    if (!pos) throw new Error(`Invalid overlayPositionKey: ${position}`);
    return pos;
  }
}
