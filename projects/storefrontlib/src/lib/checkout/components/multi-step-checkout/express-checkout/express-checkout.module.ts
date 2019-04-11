import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ConfigModule, CmsConfig } from '@spartacus/core';
import { ExpressCheckoutComponent } from './express-checkout.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        ExpressCheckoutComponent: {
          selector: 'cx-express-checkout',
        },
      },
    }),
  ],
  declarations: [ExpressCheckoutComponent],
  entryComponents: [ExpressCheckoutComponent],
  exports: [ExpressCheckoutComponent],
})
export class ExpressCheckoutModule {}
