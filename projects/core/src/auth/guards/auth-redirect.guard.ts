import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthRedirectService } from './auth-redirect.service';

@Injectable({
  providedIn: 'root',
})
export class AuthRedirectGuard implements CanActivate {
  static GUARD_NAME = 'AuthRedirectGuard';

  constructor(
    private router: Router,
    private authRedirectService: AuthRedirectService
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const baseUrl = this.router.serializeUrl(this.router.parseUrl('/'));
    const previousUrl = this.router.url.replace(baseUrl, '');
    const newUrl = state.url.replace(baseUrl, '');

    // spike todo make it configurable and place in separate function (extension point)
    this.authRedirectService.notify(previousUrl, newUrl);
    return true;
  }
}
