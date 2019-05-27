import { CheckoutConfig } from './checkout-config';
import { ShippingAddressComponent } from '../shipping-address/shipping-address.component';
import { ReviewSubmitComponent } from '../review-submit/review-submit.component';
import { DeliveryModeComponent } from '../delivery-mode/delivery-mode.component';
import { PaymentMethodComponent } from '../payment-method/payment-method.component';
import { TaxinvoiceComponent } from '../taxinvoice/taxinvoice.component';

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
  components: [
    TaxinvoiceComponent,
    ShippingAddressComponent,
    DeliveryModeComponent,
    TaxinvoiceComponent,
    PaymentMethodComponent,
    ReviewSubmitComponent
  ]
};
