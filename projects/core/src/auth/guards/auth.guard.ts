import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../facade/auth.service';
import { UserToken } from '../models/token-types.model';
import { AuthRedirectService } from './auth-redirect.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  static GUARD_NAME = 'AuthGuard';

  constructor(
    private router: Router,
    private authService: AuthService,
    private authRedirectService: AuthRedirectService
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.getUserToken().pipe(
      map((token: UserToken) => {
        if (!token.access_token) {
          this.authRedirectService.setUrl(state.url);
          const loginUrl = '/login'; // spike todo get from config!
          return this.router.parseUrl(loginUrl);
        }
        return !!token.access_token;
      })
    );
  }
}
