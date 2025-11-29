import { HttpErrorResponse } from '@angular/common/http';
import { TOASTER_POSITION_BOTTOM_LEFT } from '@ikigaidev/elements';
import { IntakeStatus } from '@ikigaidev/hl/contracts';
import { OpenComponentConfig } from '@ikigaidev/overlay';

export const intakeLogSuccessToasterConfig: (
  status: IntakeStatus,
  itemName: string,
) => OpenComponentConfig = (status, name) => ({
  data: {
    showCloseBtn: true,
    message: `${name} - Logged as ${status}`,
    type: 'info',
    contentType: 'overflow',
  },
  position: TOASTER_POSITION_BOTTOM_LEFT,
});

export const intakeLogErrorToasterConfig: (
  itemName: string,
  err: HttpErrorResponse,
) => OpenComponentConfig = (name, err) => ({
  data: {
    showCloseBtn: true,
    message: `Error while trying to log - ${name}. Cause: ${err.statusText}`,
    type: 'danger',
    contentType: 'overflow',
  },
  position: TOASTER_POSITION_BOTTOM_LEFT,
});
