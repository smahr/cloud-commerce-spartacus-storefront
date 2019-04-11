import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ConfigModule, CmsConfig, AuthGuard } from '@spartacus/core';
import { ExpressCheckoutComponent } from './express-checkout.component';
import { CartNotEmptyGuard } from 'projects/storefrontlib/src/lib/ui/pages/guards';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        ExpressCheckoutComponent: {
          selector: 'cx-express-checkout',
          guards: [AuthGuard, CartNotEmptyGuard],
        },
      },
    }),
  ],
  declarations: [ExpressCheckoutComponent],
  entryComponents: [ExpressCheckoutComponent],
  exports: [ExpressCheckoutComponent],
})
export class ExpressCheckoutModule {}
