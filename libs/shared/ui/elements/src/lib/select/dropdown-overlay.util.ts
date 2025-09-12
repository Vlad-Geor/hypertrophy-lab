import {
  ConnectedOverlayDirective,
  OVERLAY_POSITIONS,
  WITH_TRANSPARENT_BACKDROP,
} from '@ikigaidev/overlay';

export function configCommonDropdownOverlay(overlay: ConnectedOverlayDirective): void {
  overlay?._mode.set('click');
  overlay?._hideChevron.set(true);
  overlay?._overlayPosition.set(OVERLAY_POSITIONS.bottom.center);
  overlay?._overlayConfig.set(WITH_TRANSPARENT_BACKDROP);
}
