import { MuscleGroup } from './muscle-group.model';

export type SubMuscles = {
  [key in MuscleGroup]: (typeof subMuscles)[key][number];
};

export const subMuscles = {
  abs: ['upper abs', 'lower abs', 'obliques'] as const,
  back: [
    'upper traps',
    'middle traps',
    'lower traps',
    'upper lats',
    'lower lats',
    'rhomboid major',
    'rhomboid minor',
    'erectors',
  ] as const,
  biceps: ['short head', 'long head'] as const,
  chest: ['upper chest', 'mid chest', 'lower chest'] as const,
  forearms: ['elbow flexion', 'wrist flexion', 'wrist extension'] as const,
  glutes: ['maximus', 'medius', 'minimus'] as const,
  neck: ['rotation', 'extension'] as const,
  quads: ['short head', 'long head'] as const,
  shoulders: ['front shoulder', 'side shoulder', 'rear shoulder'] as const,
  triceps: ['short head', 'long head'] as const,
  calves: [''] as const,
  hamstring: [''] as const,
};
