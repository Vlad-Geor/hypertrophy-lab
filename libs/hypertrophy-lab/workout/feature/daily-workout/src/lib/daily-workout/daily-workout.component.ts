import { CommonModule, KeyValuePipe } from '@angular/common';
import { Component } from '@angular/core';
import { DividerComponent } from '@ikigaidev/elements';
import { ExerciseListComponent } from '@ikigaidev/exercise-list';
import { MuscleGroupCardComponent } from 'libs/hypertrophy-lab/ui-non-lib/muscle-group-card/src';
import { muscleGroupExercises } from './muscle-group-exercise.mock';

@Component({
  selector: 'hl-daily-workout',
  standalone: true,
  imports: [
    CommonModule,
    MuscleGroupCardComponent,
    KeyValuePipe,
    DividerComponent,
    ExerciseListComponent,
  ],
  templateUrl: './daily-workout.component.html',
})
export class DailyWorkoutComponent {
  // 1. Get trainee workout for the day
  // 2. Loop through Exercises
  // TBD think through the design of muscleGroupExercises, along it's usage.
  // Think from the perspective of the backend, and how you'll be sending it here.

  groupExercises = muscleGroupExercises;
}
