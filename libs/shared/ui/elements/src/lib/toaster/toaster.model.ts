import { IconType } from '@ikigaidev/model';

export type ToasterType = 'info' | 'danger' | 'warning' | 'success';
export type ToasterContentType = 'standard' | 'overflow';

export const toasterAppearanceDurations: Record<ToasterType, number> = {
  info: 5000,
  success: 5000,
  warning: 7000,
  danger: 7000,
};

export const toasterTypeIcons: Record<ToasterType, IconType> = {
  success: 'award-solid',
  warning: 'award-solid',
  danger: 'award-solid',
  info: 'award-solid',
};

export interface ToasterOverlayData {
  showCloseBtn?: boolean;
  type?: ToasterType;
  contentType?: ToasterContentType;
  message: string;
  buttonLabel?: string;
  linkLabel?: string;
  onLinkClick?: () => void;
  onButtonClick?: () => void;
  onCloseClick?: () => void;
}
