import { Component, input } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { ExerciseDetailsCardComponent } from '@ikigaidev/exercise-details-card';
import { MuscleGroupExercises } from '@ikigaidev/hl/model';
import { TagComponent } from '@ikigaidev/elements';

@Component({
  selector: 'hl-exercise-list',
  standalone: true,
  imports: [CommonModule, ExerciseDetailsCardComponent, TagComponent ,KeyValuePipe],
  templateUrl: './exercise-list.component.html',
  styleUrl: './exercise-list.component.scss',
})
export class ExerciseListComponent {
  exerciseList = input<MuscleGroupExercises>();
}
