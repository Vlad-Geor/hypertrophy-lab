export const healthTargets = [
  'arteries',
  'brain',
  'digestion',
  'energy',
  'focus',
  'heart',
  'hypertrophy',
  'immune',
  'veins',
  'relaxation',
  'antioxidant',
  'eyes',
] as const;

export type HealthTarget = (typeof healthTargets)[number];

export const HEALTH_TARGETS: Record<HealthTarget, string> = {
  brain: 'Brain Health',
  energy: 'Energy Production',
  heart: 'Heart Health',
  hypertrophy: 'Hypertrophy',
  immune: 'Immune Function',
  relaxation: 'Relaxation Aid',
  arteries: 'Arterial Health',
  veins: 'Venous Health',
  digestion: 'Gut Health',
  focus: 'Focus',
  antioxidant: 'Antioxidant',
  eyes: 'Eye Health',
};
