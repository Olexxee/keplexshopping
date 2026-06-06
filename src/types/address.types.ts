import type { ReactNode } from "react";

export interface Address {
  fullName: ReactNode;
  phone: ReactNode;
  id: string;
  label: string; // e.g. "Home", "Office"
  street: string;
  city: string;
  postalCode: string;
  addressLine?: string; // Optional second line for apartment, suite, etc.
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
  addressLine?: string;
}
