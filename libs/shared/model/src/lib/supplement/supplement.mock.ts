import { of } from 'rxjs';
import { Supplement } from './supplement.model';

export const supplements: Supplement[] = [
  {
    name: 'Vitamin D',
    healthTargets: ['brain'],
    itemCount: 60,
    recommendedBrands: [{ name: 'California Gold Nutrition' }],
  },
  {
    name: 'Vitamin C',
    healthTargets: ['heart'],
    itemCount: 60,
    recommendedBrands: [{ name: 'California Gold Nutrition' }],
  },
  {
    name: 'Vitamin B',
    healthTargets: ['hypertrophy'],
    itemCount: 60,
    recommendedBrands: [{ name: 'California Gold Nutrition' }],
  },
  {
    name: 'Chlorella',
    healthTargets: ['relaxation'],
    itemCount: 60,
    recommendedBrands: [{ name: 'California Gold Nutrition' }],
  },
];

export const supplementData = of(supplements);
