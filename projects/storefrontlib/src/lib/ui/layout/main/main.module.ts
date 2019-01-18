import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { GlobalMessageComponentModule } from '../../../global-message/global-message.module';
import { CmsModule } from '../../../cms/cms.module';
import { LoginModule } from '../../../user/components/login/login.module';

import { UiFrameworkModule } from '../../ui-framework/ui-framework.module';

import { StorefrontComponent } from './storefront.component';
import { HeaderModule } from './../header/header.module';
import { FooterComponent } from '../footer/footer.component';
import { OutletRefModule } from '../../../outlet/outlet-ref/outlet-ref.module';
import { PwaModule } from './../../../pwa/pwa.module';
import { PageTemplateModule } from '../page-template/page-template.module';
import { OutletModule } from '../../../outlet';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    GlobalMessageComponentModule,
    CmsModule,
    LoginModule,
    HeaderModule,
    UiFrameworkModule,
    OutletModule,
    OutletRefModule,
    PageTemplateModule,
    PwaModule
  ],
  declarations: [StorefrontComponent, FooterComponent],
  exports: [StorefrontComponent]
})
export class MainModule {}
