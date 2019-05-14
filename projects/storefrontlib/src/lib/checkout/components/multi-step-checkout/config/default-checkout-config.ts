import { CheckoutConfig } from './checkout-config';

export const defaultCheckoutConfig: CheckoutConfig = {
  steps: [
    {
      label: 'shippingAddress',
      name: 'shipping address',
      url: '/shipping-address',
    },
    {
      label: 'deliveryMode',
      name: 'delivery mode',
      url: '/delivery-mode',
    },
    { label: 'taxInvoice', name: 'tax invoice', url: '/checkout/tax-invoice' },
    {
      label: 'paymentMethod',
      name: 'payment method',
      url: '/payment-details',
    },
    {
      label: 'reviewSubmit',
      name: 'review submit',
      url: '/review-order',
    },
  ],
};
