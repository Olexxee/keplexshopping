export interface PaymentInitResponse {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export interface PaymentVerifyResponse {
  status: string;
  reference: string;
  amount: number;
  orderId: string;
}
