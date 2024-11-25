import { Route } from '@angular/router';
import { DailyWorkoutOverviewComponent } from '@ikigaidev/hl/daily-workout-overview';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'todays-workout',
    pathMatch: 'full',
  },
  {
    path: 'todays-workout',
    component: DailyWorkoutOverviewComponent,
  },
];
