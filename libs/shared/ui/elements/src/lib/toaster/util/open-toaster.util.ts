import { GlobalOverlay, OpenComponentConfig } from '@ikigaidev/overlay';
import { ToasterComponent } from '../toaster.component';

export function openToaster(
  overlay: GlobalOverlay,
  openComponentConfig?: OpenComponentConfig,
): void {
  overlay.openComponent(ToasterComponent, openComponentConfig);
}
