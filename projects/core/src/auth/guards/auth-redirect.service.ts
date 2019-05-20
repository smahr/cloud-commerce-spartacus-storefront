import { Injectable, Injector } from '@angular/core';

import { RoutingService } from '../../routing/facade/routing.service';
import {
  Router,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';

@Injectable()
export class AuthRedirectService {
  constructor(private routing: RoutingService, private injector: Injector) {}

  private router: Router;
  private redirectUrl: string;
  private initCalled = false;

  init() {
    if (this.initCalled) {
      return;
    }
    this.initCalled = true;

    this.router = this.injector.get(Router);
    this.router.events.subscribe(
      (e: NavigationEnd | NavigationCancel | NavigationError) => {
        if (
          // spike todo: check if navigation end suffices
          e instanceof NavigationEnd ||
          e instanceof NavigationCancel ||
          e instanceof NavigationError
        ) {
          if (this.shouldClearRedirectUrl(e.url)) {
            this.redirectUrl = undefined;
          }
        }
      }
    );
  }

  setUrl(url: string) {
    this.redirectUrl = url;
  }

  go() {
    if (this.redirectUrl === undefined) {
      this.routing.go({ cxRoute: 'home' });
    } else {
      this.routing.goByUrl(this.redirectUrl);
      this.redirectUrl = undefined;
    }
  }

  protected shouldClearRedirectUrl(currentUrl: string): boolean {
    return currentUrl !== this.redirectUrl && !this.isAuthUrl(currentUrl);
  }

  private isAuthUrl(url: string): boolean {
    const shortUrl = this.removeUrlPrefix(url);

    // spike todo: compare only segments, not hash and query params! now we compare full link, i.e. /login?something=true !== /login
    return shortUrl === '/login' || shortUrl === '/login/register'; // spike todo use configurable routes here
  }

  /**
   * Removes prefix that comes from the url serializer (i.e. site context url params)
   */
  private removeUrlPrefix(url: string): string {
    const urlPrefix = this.router.serializeUrl(this.router.parseUrl('/'));
    const shortUrl = url.replace(urlPrefix, '');
    return shortUrl + '/';
  }
}
