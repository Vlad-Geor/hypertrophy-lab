import { MuscleGroup } from '../muscle/muscle-group.model';
import { SubMuscles } from '../muscle/sub-muscles.model';
import { ExerciseEquipment } from './exercise-equipment.model';
import { Movement } from './movement.model';

export type ExerciseGoal = 'strength' | 'cardio' | 'size';

export type ExerciseDetails<T extends MuscleGroup> = {
  targetMuscle: T;
  targetSubMuscle: SubMuscles[T];
  movement: Movement[T];
  equipment: ExerciseEquipment;
  exerciseGoals?: ExerciseGoal[];
  videoUrl?: string;
  sets: number;
  reps: number;
  weight?: number;
  weightUnits?: 'kg' | 'lbs';
};
// targetMuscle: T;

// export type ExerciseDetails = {
//   [K in MuscleGroup]: {
//     targetMuscle: K;
//     movement: Movement[K];
//     targetSubMuscle: SubMuscles[K];
//     equipment: ExerciseEquipment;
//     sets: number;
//     reps: number;
//   };
// }[MuscleGroup];
