import { of } from 'rxjs';
import { Supplement } from './supplement.model';

export const supplements: Supplement[] = [
  {
    name: 'Vitamin D',
    healthTargets: ['brain'],
    packageQuantity: 60,
    recommendedBrands: [{ name: 'California Gold Nutrition' }],
  },
  {
    name: 'Vitamin C',
    healthTargets: ['heart'],
    packageQuantity: 60,
    recommendedBrands: [{ name: 'California Gold Nutrition' }],
  },
  {
    name: 'Vitamin B',
    healthTargets: ['hypertrophy'],
    packageQuantity: 60,
    recommendedBrands: [{ name: 'California Gold Nutrition' }],
  },
  {
    name: 'Chlorella',
    healthTargets: ['relaxation'],
    packageQuantity: 60,
    recommendedBrands: [{ name: 'California Gold Nutrition' }],
  },
];

export const supplementData = of(supplements);
