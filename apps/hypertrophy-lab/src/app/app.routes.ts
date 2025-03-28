import { Route } from '@angular/router';
import { DailyWorkoutComponent } from '@ikigaidev/hl/daily-workout';
import { PlaygroundComponent } from '@ikigaidev/playground';

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
  {
    path: 'nutrition',
    loadComponent: () => import ('@ikigaidev/nutrition').then(m => m.NutritionComponent)
  },
  {
    path: 'pg',
    component: PlaygroundComponent
  }
];
