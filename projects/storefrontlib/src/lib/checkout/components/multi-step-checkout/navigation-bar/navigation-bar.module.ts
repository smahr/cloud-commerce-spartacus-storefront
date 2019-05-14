import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutConfig } from '../config/checkout-config';
import { defaultCheckoutConfig } from '../config/default-checkout-config';
import { RouterModule } from '@angular/router';
import { ConfigModule, CmsConfig, Config, UrlModule } from '@spartacus/core';
import { NavigationBarComponent } from './navigation-bar.component';
@NgModule({
  declarations: [NavigationBarComponent],
  imports: [
    CommonModule,
    RouterModule,
    UrlModule,
    ConfigModule.withConfig(defaultCheckoutConfig),
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        CheckoutProgress: {
          selector: 'cx-navigation-bar',
        },
      },
    }),
  ],
  entryComponents: [NavigationBarComponent],
  exports: [NavigationBarComponent],
  providers: [{ provide: CheckoutConfig, useExisting: Config }],
})
export class NavigationBarModule {}
