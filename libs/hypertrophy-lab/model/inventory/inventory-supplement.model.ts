import { Supplement } from '../../../shared/model/src/lib/supplement/supplement.model';

export type SupplementInventoryItem = {
  quantityLeft: number;
  consumptionDaysLeft: number;
  itemData: Supplement;
};
