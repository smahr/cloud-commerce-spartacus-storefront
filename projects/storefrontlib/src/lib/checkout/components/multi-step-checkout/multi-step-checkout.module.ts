import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
  CheckoutModule,
  CmsConfig,
  ConfigModule,
  I18nModule,
  UrlModule,
} from '@spartacus/core';
import { CartSharedModule } from '../../../../cms-components/checkout/cart/cart-shared/cart-shared.module';
// import { MultiStepCheckoutComponent } from './container/multi-step-checkout.component';
import { DeliveryModeModule } from './delivery-mode/delivery-mode.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { ReviewSubmitModule } from './review-submit/review-submit.module';
import { ShippingAddressModule } from './shipping-address/shipping-address.module';
import { PlaceOrderModule } from './place-order/place-order.module';
import { NavigationBarModule } from './navigation-bar/navigation-bar.module';
import { NewCheckoutContainerComponent } from './new-checkout-container/new-checkout-container.component';
import { CheckoutComponentHostDirective } from './checkout-component-host.directive';
import { ShippingAddressComponent } from './shipping-address/shipping-address.component';
import { DeliveryModeComponent } from './delivery-mode/delivery-mode.component';
import { ReviewSubmitComponent } from './review-submit/review-submit.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { TaxinvoiceComponent } from './taxinvoice/taxinvoice.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    CartSharedModule,
    ShippingAddressModule,
    DeliveryModeModule,
    PaymentMethodModule,
    ReviewSubmitModule,
    PlaceOrderModule,
    RouterModule,
    UrlModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        NewCheckoutContainerComponent: {
          selector: 'cx-new-checkout-container',
        },
      },
    }),
    CheckoutModule,
    I18nModule,
    NavigationBarModule,
  ],
  declarations: [NewCheckoutContainerComponent, CheckoutComponentHostDirective, TaxinvoiceComponent],
  entryComponents: [NewCheckoutContainerComponent, ShippingAddressComponent, DeliveryModeComponent,
    PaymentMethodComponent,
    ReviewSubmitComponent,
    TaxinvoiceComponent
  ]
})
export class MultiStepCheckoutModule { }
