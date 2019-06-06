import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  //HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { OccEndpointsService } from '../../occ/services/occ-endpoints.service';
import { CdsConfig } from '../config/cds-config';
//import { WindowRef } from '../../window/window-ref';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class CdsConsentReferenceInterceptor implements HttpInterceptor {
  private consentRefId: string;
  private requestHeader: string;

  constructor(
    private config: CdsConfig,
    private occEndpoints: OccEndpointsService,

    @Inject(PLATFORM_ID) private platform: any
  ) {
    this.requestHeader = this.config.cds.httpHeaderName.id.toLowerCase();

    // ugly
    // instead of this use site id from cds config to resolve cookie name
    function getCookie(name) {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length == 2) return parts.pop().split(";").shift();
    }

    this.consentRefId = getCookie('yaas-consent-reference');

  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (isPlatformServer(this.platform)) {
      return next.handle(request);
    }

    if (
      this.consentRefId &&
      request.url.includes(this.occEndpoints.getBaseEndpoint())
    ) {
      request = request.clone({
        setHeaders: {
          [this.requestHeader]: this.consentRefId,
        },
      });
    }

    return next.handle(request).pipe(
      tap(event => {
        event = event; // ugly
        /*if (event instanceof HttpResponse) {
          if (event.headers.keys().includes(this.requestHeader)) {
            const receivedId = event.headers.get(this.requestHeader);
            if (this.personalizationId !== receivedId) {
              this.personalizationId = receivedId;
              this.winRef.localStorage.setItem(
                PERSONALIZATION_ID_KEY,
                this.personalizationId
              );
            }
          }
        }*/
      })
    );
  }
}
