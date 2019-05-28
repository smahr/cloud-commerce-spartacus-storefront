import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CmsConfig, CmsService, ConfigModule } from '@spartacus/core';
import { CmsComponentData } from '../../../cms-structure/page/model/cms-component-data';
// import { BootstrapModule } from '../../../lib/bootstrap.module';
import { NavigationComponentService } from '../navigation/navigation.component.service';
import { NavigationModule } from '../navigation/navigation.module';
import { CategoryNavigationComponent } from './category-navigation.component';
import { CxDropdownModule } from '../../../shared/dropdown/dropdown.module';

@NgModule({
  imports: [
    CommonModule,
    NavigationModule,
    CxDropdownModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        CategoryNavigationComponent: {
          selector: 'cx-category-navigation',
          providers: [
            {
              provide: NavigationComponentService,
              useClass: NavigationComponentService,
              deps: [CmsService, CmsComponentData],
            },
          ],
        },
      },
    }),
  ],
  declarations: [CategoryNavigationComponent],
  entryComponents: [CategoryNavigationComponent],
  exports: [CategoryNavigationComponent],
})
export class CategoryNavigationModule {}
