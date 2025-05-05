declare module 'yookassa' {
  interface YooKassaOptions {
    shopId: string;
    secretKey: string;
  }

  interface AmountInfo {
    value: string;
    currency: string;
  }

  interface ConfirmationRedirect {
    type: 'redirect';
    return_url: string;
  }

  interface PaymentCreateParams {
    amount: AmountInfo;
    confirmation: ConfirmationRedirect;
    capture: boolean;
    description?: string;
    metadata?: Record<string, any>;
  }

  interface ConfirmationResponse {
    type: string;
    confirmation_url: string;
  }

  interface PaymentResponse {
    id: string;
    status: string;
    amount: AmountInfo;
    confirmation: ConfirmationResponse;
    created_at: string;
    metadata?: Record<string, any>;
  }

  interface PaymentWebhookEvent {
    event: 'payment.succeeded' | 'payment.waiting_for_capture' | 'payment.canceled';
    object: PaymentResponse;
  }

  export default class YooKassa {
    constructor(options: YooKassaOptions);
    createPayment(params: PaymentCreateParams): Promise<PaymentResponse>;
    getPaymentInfo(paymentId: string): Promise<PaymentResponse>;
  }
} 