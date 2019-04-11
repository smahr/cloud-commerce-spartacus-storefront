import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
} from '@angular/router';

import { CheckoutConfig } from '../config/checkout-config';
import { Observable, of } from 'rxjs';

@Injectable()
export class CheckoutGuard implements CanActivate {
  constructor(private router: Router, private config: CheckoutConfig) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    if (route.queryParams.express) {
      return of(this.router.parseUrl('/checkout/express'));
    }
    return of(this.router.parseUrl(this.config.checkout.steps[0].url));
  }
}
