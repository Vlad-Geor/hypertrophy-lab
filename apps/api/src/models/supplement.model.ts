export interface Supplement {
    id?: number;               // PK (auto-increment in DB)
    name: string;
    description?: string;
    healthTarget?: string;
    dosageForm?: string;       // e.g. 'pill', 'powder'
    standardQuantity?: number; // e.g. 500 for 500 mg
    quantityUnit?: string;     // e.g. 'mg'
    recommendedUsage?: string;
    purchaseLinks?: string[];  // array of URLs
  }
  