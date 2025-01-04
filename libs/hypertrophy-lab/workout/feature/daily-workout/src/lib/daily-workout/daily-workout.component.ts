import { CommonModule, KeyValuePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ExerciseDetailsCardComponent } from '@ikigaidev/exercise-details-card';
import { ExerciseListComponent } from '@ikigaidev/exercise-list';
import { MuscleGroupExercises } from '@ikigaidev/hl/model';
import { MuscleGroupCardComponent } from '@ikigaidev/hl/ui/muscle-group-card';
import { DividerComponent } from '@ikigaidev/elements';

@Component({
  selector: 'hl-daily-workout',
  standalone: true,
  imports: [
    CommonModule,
    MuscleGroupCardComponent,
    KeyValuePipe,
    DividerComponent,
    ExerciseDetailsCardComponent,
    ExerciseListComponent,
  ],
  templateUrl: './daily-workout.component.html',
})
export class DailyWorkoutComponent {
  // 1. Get trainee workout for the day
  // 2. Loop through Exercises
  // TBD think through the design of muscleGroupExercises, along it's usage.
  // Think from the perspective of the backend, and how you'll be sending it here.

  muscleGroupExercises: MuscleGroupExercises = {
    abs: [
      {
        targetMuscle: 'abs',
        targetSubMuscle: 'lower abs',
        movement: 'crunch',
        equipment: 'dumbell',
        reps: 8,
        sets: 3,
        weight: 40,
        weightUnits: 'kg',
      },
      {
        targetMuscle: 'abs',
        targetSubMuscle: 'obliques',
        movement: 'crunch',
        equipment: 'bodyweight',
        weight: 5,
        reps: 15,
        sets: 2,
      },
      {
        targetMuscle: 'abs',
        targetSubMuscle: 'upper abs',
        movement: 'crunch',
        equipment: 'dumbell',
        reps: 20,
        sets: 2,
      },
      {
        targetMuscle: 'abs',
        targetSubMuscle: 'upper abs',
        movement: 'crunch',
        equipment: 'machine',
        reps: 15,
        sets: 2,
      },
    ],
    chest: [
      {
        targetMuscle: 'chest',
        targetSubMuscle: 'upper chest',
        movement: 'press',
        equipment: 'barbell',
        reps: 10,
        sets: 4,
        weight: 80,
        weightUnits: 'kg',
      },
      {
        targetMuscle: 'chest',
        targetSubMuscle: 'mid chest',
        movement: 'fly',
        equipment: 'machine',
        reps: 15,
        sets: 3,
        weight: 25,
        weightUnits: 'kg',
      },
    ],
    shoulders: [
      {
        targetMuscle: 'shoulders',
        targetSubMuscle: 'rear shoulder',
        movement: 'pull',
        equipment: 'machine',
        reps: 15,
        sets: 3,
        weight: 25,
        weightUnits: 'kg',
      },
    ],
  };
}
