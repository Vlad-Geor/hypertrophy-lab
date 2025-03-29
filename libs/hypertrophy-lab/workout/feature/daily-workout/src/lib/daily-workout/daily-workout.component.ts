import { CommonModule, KeyValuePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent, DividerComponent, IconComponent } from '@ikigaidev/elements';
import { ExerciseBreakdownComponent } from '@ikigaidev/exercise-details-card';
import { ExerciseListComponent } from '@ikigaidev/exercise-list';
import { MuscleGroupExercises } from '@ikigaidev/hl/model';
import { MuscleGroupCardComponent } from '@ikigaidev/hl/ui/muscle-group-card';
import { muscleGroupExercises } from './muscle-group-exercise.mock';

@Component({
  selector: 'hl-daily-workout',
  standalone: true,
  imports: [
    CommonModule,
    MuscleGroupCardComponent,
    KeyValuePipe,
    DividerComponent,
    ExerciseBreakdownComponent,
    ExerciseListComponent,
    ButtonComponent,
    IconComponent,
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
