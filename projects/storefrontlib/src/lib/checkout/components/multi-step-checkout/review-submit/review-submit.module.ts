import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { I18nModule, AuthGuard } from '@spartacus/core';
import { CardModule } from '../../../../ui/components/card/card.module';
import { ReviewSubmitComponent } from './review-submit.component';
import { CartSharedModule } from '../../../../cart/cart-shared/cart-shared.module';
import { ConfigModule, CmsConfig } from '@spartacus/core';
import { CartNotEmptyGuard } from 'projects/storefrontlib/src/lib/ui/pages/guards';

@NgModule({
  imports: [
    CommonModule,
    CardModule,
    CartSharedModule,
    I18nModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        MultistepCheckoutReviewOrder: {
          selector: 'cx-review-submit',
          guards: [AuthGuard, CartNotEmptyGuard],
        },
      },
    }),
  ],
  declarations: [ReviewSubmitComponent],
  entryComponents: [ReviewSubmitComponent],
  exports: [ReviewSubmitComponent],
})
export class ReviewSubmitModule {}
