import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MuscleGroupCardComponent } from '@ikigaidev/hl/ui/muscle-group-card';
import { ExerciseDetails } from '@ikigaidev/hl/model';

@Component({
  selector: 'lib-daily-workout-overview',
  standalone: true,
  imports: [CommonModule, MuscleGroupCardComponent],
  templateUrl: './daily-workout-overview.component.html',
})
export class DailyWorkoutOverviewComponent {
  muscleGroupCards: ExerciseDetails[] = [];
}
