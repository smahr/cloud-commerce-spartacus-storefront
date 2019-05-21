import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RoutingService } from '../../routing/facade/routing.service';
import { AuthService } from '../facade/auth.service';
import { UserToken } from '../models/token-types.model';
import { RedirectAfterAuthService } from './redirect-after-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  static GUARD_NAME = 'AuthGuard';

  constructor(
    protected routingService: RoutingService,
    protected authService: AuthService,
    protected redirectAfterAuthService: RedirectAfterAuthService,
    protected router: Router
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.getUserToken().pipe(
      map((token: UserToken) => {
        if (!token.access_token) {
          this.routingService.go({ cxRoute: 'login' });

          const navigationId = this.router.getCurrentNavigation().id;
          this.redirectAfterAuthService.reportAuthGuardedUrl(
            state.url,
            navigationId
          );
        }
        return !!token.access_token;
      })
    );
  }
}
