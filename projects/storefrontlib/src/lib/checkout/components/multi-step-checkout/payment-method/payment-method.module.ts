import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PaymentFormModule } from './payment-form/payment-form.module';
import { CardModule } from '../../../../ui/components/card/card.module';
import { PaymentMethodComponent } from './payment-method.component';
import { SpinnerModule } from './../../../../ui/components/spinner/spinner.module';
import {
  UserService,
  ConfigModule,
  CmsConfig,
  I18nModule,
  AuthGuard,
} from '@spartacus/core';
import { CartNotEmptyGuard } from 'projects/storefrontlib/src/lib/ui/pages/guards';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PaymentFormModule,
    CardModule,
    SpinnerModule,
    I18nModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        MultistepCheckoutPaymentDetails: {
          selector: 'cx-payment-method',
          guards: [AuthGuard, CartNotEmptyGuard],
        },
      },
    }),
  ],
  providers: [UserService],
  declarations: [PaymentMethodComponent],
  entryComponents: [PaymentMethodComponent],
  exports: [PaymentMethodComponent],
})
export class PaymentMethodModule {}
