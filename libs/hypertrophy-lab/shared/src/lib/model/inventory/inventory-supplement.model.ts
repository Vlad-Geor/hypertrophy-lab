import { Supplement } from "../supplement/supplement.model";

export type SupplementInventoryItem = {
  quantityLeft: number;
  consumptionDaysLeft: number;
  itemData: Supplement;
};
