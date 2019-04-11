import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutOrchestratorComponent } from './checkout-orchestrator.component';
import { ConfigModule, CmsConfig, Config, AuthGuard } from '@spartacus/core';
import { CheckoutGuard } from '../../../guards/checkout.guard';
import { defaultCheckoutConfig } from '../../../config/default-checkout-config';
import { CheckoutConfig } from '../../../config/checkout-config';
import { CartNotEmptyGuard } from 'projects/storefrontlib/src/lib/ui/pages/guards';

@NgModule({
  imports: [
    CommonModule,
    ConfigModule.withConfig(defaultCheckoutConfig),
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        CheckoutOrchestrator: {
          selector: 'cx-checkout-orchestrator',
          guards: [AuthGuard, CartNotEmptyGuard, CheckoutGuard],
        },
      },
    }),
  ],
  providers: [CheckoutGuard, { provide: CheckoutConfig, useExisting: Config }],
  declarations: [CheckoutOrchestratorComponent],
  entryComponents: [CheckoutOrchestratorComponent],
  exports: [CheckoutOrchestratorComponent],
})
export class CheckoutOrchestratorModule {}
