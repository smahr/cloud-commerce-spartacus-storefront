import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AuthService,
  RoutingService,
  UserToken,
  CartService,
} from '@spartacus/core';

@Injectable({
  providedIn: 'root',
})
export class CheckoutGuard implements CanActivate {
  static GUARD_NAME = 'CheckoutGuard';

  constructor(
    private routingService: RoutingService,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.getUserToken().pipe(
      map((token: UserToken) => {
        if (!token.access_token) {
          this.cartService.getActive().pipe(
            map(cart => {
              if (cart.user.name === 'guest' && cart.user.uid) {
                this.routingService.go({ route: ['login'] }, { forced: true });
              } else {
                this.routingService.go({ route: ['login'] });
              }
            })
          );
        }
        this.routingService.saveRedirectUrl(state.url);
        return !!token.access_token;
      })
    );
  }
}
