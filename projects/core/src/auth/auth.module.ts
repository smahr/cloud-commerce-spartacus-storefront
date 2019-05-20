import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { Config, ConfigModule } from '../config/config.module';
import { RoutingModule } from '../routing/routing.module';

import { AuthConfig } from './config/auth-config';
import { defaultAuthConfig } from './config/default-auth-config';
import { interceptors } from './http-interceptors/index';
import { services } from './services/index';
import { AuthStoreModule } from './store/auth-store.module';
import { AuthRedirectService } from './guards/auth-redirect.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RoutingModule,
    AuthStoreModule,
    ConfigModule.withConfig(defaultAuthConfig),
  ],
  providers: [...services, { provide: AuthConfig, useExisting: Config }],
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [
        ...interceptors,
        {
          provide: APP_INITIALIZER,
          useFactory: initAuthRedirectService,
          multi: true,
          deps: [AuthRedirectService],
        },
        AuthRedirectService,
      ],
    };
  }
}

function initAuthRedirectService(service: AuthRedirectService) {
  const result = () => service.init();
  return result;
}
