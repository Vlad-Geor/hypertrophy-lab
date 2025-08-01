import { HealthTarget } from "./health-target";

export const dosageForms = ['pill', 'powder', 'liquid'] as const;

export type DosageForm = (typeof dosageForms)[number];

export const quantityUnits = ['mg', 'ml', 'piece'] as const;

export type QuantityUnit = (typeof quantityUnits)[number];

export interface Supplement {
  id?: number;
  name: string;
  packageQuantity: number;
  description?: string;
  healthTargets?: HealthTarget[];
  dosageForm?: DosageForm;
  servingSize?: number;
  quantityUnit?: QuantityUnit;
  recommendedUsage?: string;
  purchaseLinks?: string[];
  recommendedBrands?: Brand[];
  imgUrl?: string;
}

export interface Brand {
  id?: number;
  name: string;
  website?: string;
}
