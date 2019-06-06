import { NgModule, ModuleWithProviders } from '@angular/core';
import { Config, ConfigModule } from '../config/config.module';
import { CdsConfig } from './config/cds-config';
import { defaultCdsConfig } from './config/default-cds-config';

import { interceptors } from './http-interceptors/index';

@NgModule({
  imports: [ConfigModule.withConfig(defaultCdsConfig)],
  providers: [{ provide: CdsConfig, useExisting: Config }],
})
export class CdsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CdsModule,
      providers: [...interceptors],
    };
  }
}
