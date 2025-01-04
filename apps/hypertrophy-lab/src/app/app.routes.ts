import { Route } from '@angular/router';
import { DailyWorkoutComponent } from '@ikigaidev/hl/daily-workout';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'todays-workout',
    pathMatch: 'full',
  },
  {
    path: 'todays-workout',
    component: DailyWorkoutComponent,
  },
];
