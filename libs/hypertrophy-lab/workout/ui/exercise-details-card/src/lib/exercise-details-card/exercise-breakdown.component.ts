import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  AccordionBodyComponent,
  AccordionComponent,
  AccordionHeaderComponent,
} from '@ikigaidev/accordion';
import { IconComponent, TagComponent } from '@ikigaidev/elements';
import { ExerciseDetails, MuscleGroup } from '@ikigaidev/hl/model';

@Component({
  selector: 'hl-exercise-breakdown',
  imports: [
    CommonModule,
    AccordionComponent,
    AccordionHeaderComponent,
    AccordionBodyComponent,
    TagComponent,
    IconComponent,
  ],
  templateUrl: './exercise-breakdown.component.html',
  styleUrl: './exercise-breakdown.component.scss',
})
export class ExerciseBreakdownComponent<T extends MuscleGroup = MuscleGroup> {
  exercises = input.required<ExerciseDetails<T>[]>();
}
