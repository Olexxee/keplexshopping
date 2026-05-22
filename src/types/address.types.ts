export interface Address {
  id: string;
  label: string; // e.g. "Home", "Office"
  street: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
}

export interface AddressPayload {
  label: string;
  street: string;
  city: string;
  state: string;
  country: string;
  isDefault?: boolean;
}
