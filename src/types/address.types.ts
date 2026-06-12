export interface Address {
  id: string;

  fullName: string;
  phone: string;

  label: string;

  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;

  addressLine?: string;

  isDefault: boolean;
}

export interface AddressPayload {
  label: string;
  street: string;
  city: string;
  state: string;
  country: string;
  isDefault?: boolean;
  addressLine?: string;
}
