export interface Supplement {
    id?: number;
    name: string;
    description?: string;
    healthTarget?: 'energy production' | 'heart health' | 'immunity boost' | 'cognitive function' | '';  // e.g., 'energy', 'heart', 'immune'
    dosageForm?: 'pill' | 'powder' | 'liquid';    // e.g., 'pill', 'powder'
    standardQuantity?: number;
    quantityUnit?: 'mg' | 'ml' | 'piece';  // e.g., 'mg', 'piece'
    recommendedUsage?: string;
    purchaseLinks?: string[];
    recommendedBrands?: Brand[];
  }
  
  export interface Brand {
    id?: number;
    name: string;
    website?: string;
  }
  