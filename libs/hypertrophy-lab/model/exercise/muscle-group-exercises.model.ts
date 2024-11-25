import { MuscleGroup } from '../muscle/muscle-group.model';
import { ExerciseDetails } from './exercise-details.model';

export type MuscleGroupExercises = Partial<{
  [K in MuscleGroup]: ExerciseDetails<K>[];
}>;

// export type MuscleGroupExercises<T extends MuscleGroup = MuscleGroup> = {
//   muscleGroup: T;
//   exercises: ExerciseDetails<T>[];
// };
