import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { I18nModule, AuthGuard } from '@spartacus/core';
import { AddressFormModule } from './address-form/address-form.module';
import { CardModule } from '../../../../ui/components/card/card.module';
import { ShippingAddressComponent } from './shipping-address.component';
import { SpinnerModule } from './../../../../ui/components/spinner/spinner.module';
import { ConfigModule, CmsConfig } from '@spartacus/core';
import { CartNotEmptyGuard } from 'projects/storefrontlib/src/lib/ui/pages/guards';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AddressFormModule,
    CardModule,
    SpinnerModule,
    I18nModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        MultistepCheckoutShippingAddress: {
          selector: 'cx-shipping-address',
          guards: [AuthGuard, CartNotEmptyGuard],
        },
      },
    }),
  ],
  declarations: [ShippingAddressComponent],
  entryComponents: [ShippingAddressComponent],
  exports: [ShippingAddressComponent],
})
export class ShippingAddressModule {}
