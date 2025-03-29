import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ExerciseDetails, MuscleGroup } from '@ikigaidev/hl/model';
import { AccordionBodyComponent, AccordionComponent, AccordionHeaderComponent, TagComponent } from '@ikigaidev/ui';
import { OverlayDirective } from '@ikigaidev/directive';
import { IconComponent } from '@ikigaidev/elements';

@Component({
  selector: 'hl-exercise-breakdown',
  imports: [CommonModule, AccordionComponent, AccordionHeaderComponent, AccordionBodyComponent, TagComponent, IconComponent, OverlayDirective],
  templateUrl: './exercise-breakdown.component.html',
  styleUrl: './exercise-breakdown.component.scss',
})
export class ExerciseBreakdownComponent<T extends MuscleGroup = MuscleGroup> {
  exercises = input.required<ExerciseDetails<T>[]>();
}
