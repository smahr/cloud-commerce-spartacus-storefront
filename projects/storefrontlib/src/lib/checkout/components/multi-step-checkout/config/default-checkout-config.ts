import { CheckoutConfig } from './checkout-config';

export const defaultCheckoutConfig: CheckoutConfig = {
  steps: [
    { name: 'shippingAddress', url: '/checkout/shipping-address' },
    { name: 'deliveryMode', url: '/checkout/delivery-mode' },
    { name: 'taxInvoice', url: '/checkout/tax-invoice' },
    { name: 'paymentMethod', url: '/checkout/payment-details' },
    { name: 'reviewSubmit', url: '/checkout/review-order' },
  ],
};
