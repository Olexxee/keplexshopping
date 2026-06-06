export interface TrainingProgram {
  id: string;
  title: string;
  price: number;
  active: boolean;
}

export interface ImportationSettings {
  enabled: boolean;
  showOnLandingPage: boolean;
  showInStore: boolean;
}

export interface PricingRules {
  globalDiscount: number;

  trainingPromo: {
    active: boolean;
    percent: number;
  };
}

export interface StoreSettings {
  showImportedCategory: boolean;
  featuredCategories: string[];
}

export interface BusinessConfigResponse {
  training_programs: TrainingProgram[];

  importation_settings: ImportationSettings;

  pricing_rules: PricingRules;

  store_settings: StoreSettings;
}
