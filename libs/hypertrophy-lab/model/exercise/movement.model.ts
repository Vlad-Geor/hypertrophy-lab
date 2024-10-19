import { MuscleGroup } from '../muscle/muscle-group.model';

export type Movement = {
  [key in MuscleGroup]: (typeof movements)[key][number];
};

export const movements = {
  neck: ['flexion', 'extension', 'lateral flexion'] as const,
  shoulders: ['press', 'raise', 'rotation', 'shrug'] as const,
  chest: ['press', 'fly', 'pullover'] as const,
  back: ['row', 'pull', 'deadlift'] as const,
  triceps: ['extension', 'press', 'pushdown'] as const,
  biceps: ['curl', 'rotation'] as const,
  forearms: ['curl', 'extension', 'pronation', 'supination'] as const,
  abs: ['crunch', 'rotation', 'plank'] as const,
  glutes: ['squat', 'lunge', 'thrust'] as const,
  calves: ['raise', 'extension'] as const,
  hamstring: ['curl', 'deadlift'] as const,
  quads: ['squat', 'extension', 'press'] as const,
};
