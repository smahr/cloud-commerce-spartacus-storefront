import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ConfigModule, CmsConfig } from '@spartacus/core';
import { ExpressButtonComponent } from './express-button.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        ExpressCheckoutButton: {
          selector: 'cx-express-button',
        },
      },
    }),
  ],
  declarations: [ExpressButtonComponent],
  entryComponents: [ExpressButtonComponent],
  exports: [ExpressButtonComponent],
})
export class ExpressButtonModule {}
