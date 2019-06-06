import { Provider } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { CdsConsentReferenceInterceptor } from './cds-consentref.interceptor';


export const interceptors: Provider[] = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: CdsConsentReferenceInterceptor,
    multi: true,
  }
];
