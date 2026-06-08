export interface TrainingProgram {
  id: string;
  title: string;
  slug: string;

  shortDescription?: string;
  description?: string;

  imageUrl?: string;

  price: number;

  featured: boolean;
  active: boolean;

  displayOrder: number;

  highlights?: string[];

  createdAt: string;
  updatedAt: string;
}

export interface TrainingProgramFormValues {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  active: boolean;
  featured: boolean;
  displayOrder: number;
  highlights: string[];
}


