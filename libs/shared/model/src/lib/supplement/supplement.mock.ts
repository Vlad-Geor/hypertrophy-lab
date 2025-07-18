import { of } from 'rxjs';
import { Supplement } from './supplement.model';

export const supplements: Supplement[] = [
  {
    name: 'Vitamin D',
    healthTarget: 'brain',
    recommendedBrands: [{ name: 'California Gold Nutrition' }],
  },
  {
    name: 'Vitamin C',
    healthTarget: 'heart',
    recommendedBrands: [{ name: 'California Gold Nutrition' }],
  },
  {
    name: 'Vitamin B',
    healthTarget: 'hypertrophy',
    recommendedBrands: [{ name: 'California Gold Nutrition' }],
  },
  {
    name: 'Chlorella',
    healthTarget: 'relaxation',
    recommendedBrands: [{ name: 'California Gold Nutrition' }],
  },
];

export const supplementData = of(supplements);
