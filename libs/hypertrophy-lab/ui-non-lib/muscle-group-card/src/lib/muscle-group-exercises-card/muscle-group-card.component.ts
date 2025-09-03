import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { ExerciseDetails, MuscleGroup } from '@ikigaidev/hl/model';

@Component({
  selector: 'hl-muscle-group-card',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './muscle-group-card.component.html',
})
export class MuscleGroupCardComponent<T extends MuscleGroup = MuscleGroup> {
  muscleGroupExercises = input.required<ExerciseDetails<T>[]>();
}
