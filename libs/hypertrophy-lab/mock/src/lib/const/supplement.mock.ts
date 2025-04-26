import { Supplement } from '@ikigaidev/hl/model';
import { of } from 'rxjs';

const supplementData: Supplement[] = [
  {
    name: 'Vitamin D',
    description:
      'Vitamin D is a fat-soluble vitamin that is important for bone health and immune function. It can be obtained from sunlight, food sources, and supplements.',
    purchaseLinks: ['https://www.amazon.com/Vitamin-D-3-5000IU-Softgels/dp/B00I7X2Q4G'],
    quantityUnit: 'mg',
    dosageForm: 'powder',
    standardQuantity: 1000,
  },
  {
    name: 'Vitamin C',
    description:
      'Vitamin C is a water-soluble vitamin that is important for immune function, collagen synthesis, and antioxidant protection. It can be obtained from fruits and vegetables.',
    purchaseLinks: [
      'https://www.amazon.com/Vitamin-C-1000mg-Buffered-Supplement/dp/B00I7X2Q4G',
    ],
    quantityUnit: 'mg',
    dosageForm: 'pill',
    standardQuantity: 1,
  },
];

export const supplements = of(supplementData);
