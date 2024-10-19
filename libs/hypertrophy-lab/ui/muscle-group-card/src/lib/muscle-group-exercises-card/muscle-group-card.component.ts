import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ExerciseDetails } from 'libs/hypertrophy-lab/model';

@Component({
  selector: 'lib-muscle-group-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './muscle-group-card.component.html',
})
export class MuscleGroupCardComponent {
  muscleGroupExercises = input.required<ExerciseDetails>();
}
