import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ExerciseDetails, MuscleGroup } from '@ikigaidev/hl/model';
import { AccordionBodyComponent, AccordionComponent, AccordionHeaderComponent, TagComponent } from '@ikigaidev/ui';

@Component({
  selector: 'hl-exercise-details-card',
  standalone: true,
  imports: [CommonModule, AccordionComponent, AccordionHeaderComponent, AccordionBodyComponent, TagComponent],
  templateUrl: './exercise-details-card.component.html',
  styleUrl: './exercise-details-card.component.scss',
})
export class ExerciseDetailsCardComponent<T extends MuscleGroup = MuscleGroup> {
  exercises = input.required<ExerciseDetails<T>[]>();
}
