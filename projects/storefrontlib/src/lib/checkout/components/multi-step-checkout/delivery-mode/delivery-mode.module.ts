import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ConfigModule, CmsConfig, I18nModule } from '@spartacus/core';
import { DeliveryModeComponent } from './delivery-mode.component';
import { DeliveryModeSaveComponent } from './delivery-mode-save.component';
import { SpinnerModule } from '../../../../ui/components/spinner/spinner.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    I18nModule,
    SpinnerModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        MultistepCheckoutDeliveryMode: {
          selector: 'cx-delivery-mode',
        },
        MultistepCheckoutDeliveryModeSave: {
          selector: 'cx-delivery-mode-save',
        },
      },
    }),
  ],
  declarations: [DeliveryModeComponent, DeliveryModeSaveComponent],
  entryComponents: [DeliveryModeComponent, DeliveryModeSaveComponent],
  exports: [DeliveryModeComponent, DeliveryModeSaveComponent],
})
export class DeliveryModeModule {}
