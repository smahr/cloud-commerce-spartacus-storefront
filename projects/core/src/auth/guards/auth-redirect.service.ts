import { Injectable } from '@angular/core';

import { RoutingService } from '../../routing/facade/routing.service';

@Injectable({
  providedIn: 'root',
})
export class AuthRedirectService {
  constructor(private routing: RoutingService) {}

  private redirectUrl: string;

  go() {
    if (this.redirectUrl === undefined) {
      this.routing.go('/');
    } else {
      this.routing.goByUrl(this.redirectUrl);
      this.redirectUrl = undefined;
    }
  }

  notify(previousUrl: string, newUrl: string) {
    if (this.shouldSaveRedirectUrl(previousUrl, newUrl)) {
      this.redirectUrl = previousUrl;
    }
  }

  protected shouldSaveRedirectUrl(
    previousUrl: string,
    newUrl: string
  ): boolean {
    // don't save url if you already come from login/register pages
    if (this.isAuthUrl(previousUrl)) {
      return false;
    }
    return this.isAuthUrl(newUrl);
  }

  protected isAuthUrl(url: string): boolean {
    return url === 'login' || url === 'register'; // spike todo use configurable routes here
  }
}
