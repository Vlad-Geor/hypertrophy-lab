import { MuscleGroupExercises } from "@ikigaidev/hl/model";

export const muscleGroupExercises: MuscleGroupExercises = {
    abs: [
      {
        targetMuscle: 'abs',
        targetSubMuscle: 'lower abs',
        movement: 'crunch',
        equipment: 'dumbell',
        reps: 8,
        sets: 3,
        weight: 40,
        weightUnits: 'kg',
        exerciseGoals: ['size', 'strength']
      },
      {
        targetMuscle: 'abs',
        targetSubMuscle: 'obliques',
        movement: 'crunch',
        equipment: 'bodyweight',
        weight: 5,
        reps: 15,
        sets: 2,
        exerciseGoals: ['size', 'cardio']
      },
      {
        targetMuscle: 'abs',
        targetSubMuscle: 'upper abs',
        movement: 'crunch',
        equipment: 'dumbell',
        reps: 20,
        sets: 2,
        exerciseGoals: ['size', 'cardio']
      },
      {
        targetMuscle: 'abs',
        targetSubMuscle: 'upper abs',
        movement: 'crunch',
        equipment: 'machine',
        reps: 15,
        sets: 2,
        exerciseGoals: ['size', 'cardio']
      },
    ],
    chest: [
      {
        targetMuscle: 'chest',
        targetSubMuscle: 'upper chest',
        movement: 'press',
        equipment: 'barbell',
        reps: 10,
        sets: 4,
        weight: 80,
        weightUnits: 'kg',
        exerciseGoals: ['size', 'strength']
      },
      {
        targetMuscle: 'chest',
        targetSubMuscle: 'mid chest',
        movement: 'fly',
        equipment: 'machine',
        reps: 15,
        sets: 3,
        weight: 25,
        weightUnits: 'kg',
        exerciseGoals: ['size', 'cardio']
      },
    ],
    shoulders: [
      {
        targetMuscle: 'shoulders',
        targetSubMuscle: 'rear shoulder',
        movement: 'pull',
        equipment: 'machine',
        reps: 15,
        sets: 3,
        weight: 25,
        weightUnits: 'kg',
        exerciseGoals: ['size', 'cardio']
      },
    ],
  };