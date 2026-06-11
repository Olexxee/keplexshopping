export interface PaymentMethod {
  id: string;

  brand: string;

  last4: string;

  expiryMonth: number;

  expiryYear: number;

  isDefault: boolean;

  createdAt: string;
}
