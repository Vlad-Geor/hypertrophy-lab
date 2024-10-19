import { MuscleGroup } from '../muscle/muscle-group.model';
import { SubMuscles } from '../muscle/sub-muscles.model';
import { ExerciseEquipment } from './exercise-equipment.model';
import { Movement } from './movement.model';

export type ExerciseDetails = {
  movement: Movement[MuscleGroup];
  targetSubMuscle: SubMuscles[MuscleGroup];
  targetMuslce: MuscleGroup;
  equipment: ExerciseEquipment;
  sets: number;
  reps: number;
};

// export const ExercisesPerGroup: ExercisesPerGroup = {
//   abs: ['upper abs', 'lower abs', 'obliques'],
//   back: [
//     'upper traps',
//     'middle traps',
//     'lower traps',
//     'upper lats',
//     'lower lats',
//     'rhomboid major',
//     'rhomboid minor',
//     'erectors',
//   ],
//   biceps: ['short head', 'long head'],
//   chest: ['upper chest', 'mid chest', 'lower chest'],
//   forearms: [
//     'brachioradialis - elbow flexion',
//     'flexor Group',
//     'extensor Group',
//   ],
//   glutes: ['maximus', 'medius', 'minimus'],
//   neck: ['side neck', 'front neck', 'back neck'],
//   quads: ['short head', 'long head'],
//   shoulders: ['front shoulder', 'side shoulder', 'rear shoulder'],
//   triceps: ['short head', 'long head'],
//   calves: ['gastrocnemius - main muscle', 'soleus - side calf'],
//   hamstring: ['biceps femoris - inner hamstring', 'semimembranosus'],
// };
