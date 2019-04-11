import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PlaceOrderComponent } from './place-order.component';
import {
  UrlTranslationModule,
  CheckoutModule,
  I18nModule,
  ConfigModule,
  CmsConfig,
} from '@spartacus/core';

@NgModule({
  imports: [
    CommonModule,
    CheckoutModule,
    RouterModule,
    UrlTranslationModule,
    I18nModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        MultistepCheckoutPlaceOrder: {
          selector: 'cx-place-order',
        },
      },
    }),
  ],
  declarations: [PlaceOrderComponent],
  entryComponents: [PlaceOrderComponent],
  exports: [PlaceOrderComponent],
})
export class PlaceOrderModule {}
