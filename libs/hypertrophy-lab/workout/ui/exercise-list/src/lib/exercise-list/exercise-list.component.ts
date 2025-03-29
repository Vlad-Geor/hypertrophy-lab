import { CommonModule, KeyValuePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { TagComponent } from '@ikigaidev/elements';
import { ExerciseBreakdownComponent } from '@ikigaidev/exercise-details-card';
import { MuscleGroupExercises } from '@ikigaidev/hl/model';

@Component({
  selector: 'hl-exercise-list',
  imports: [CommonModule, ExerciseBreakdownComponent, TagComponent, KeyValuePipe],
  templateUrl: './exercise-list.component.html',
  styleUrl: './exercise-list.component.scss',
})
export class ExerciseListComponent {
  exerciseList = input<MuscleGroupExercises>();
}
