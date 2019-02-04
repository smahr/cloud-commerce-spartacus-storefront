import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Observable, combineLatest } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { AuthService } from '../facade/auth.service';
import { CartService } from '../../cart/facade/cart.service';
import { RoutingService } from '../../routing/facade/routing.service';

@Injectable({
  providedIn: 'root'
})
export class TestGuard implements CanActivate {
  static GUARD_NAME = 'TestGuard';

  constructor(
    private routingService: RoutingService,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> {
    return combineLatest(
      this.cartService.getLoaded(),
      this.cartService.getActive(),
      this.authService.getUserToken()
    ).pipe(
      filter(([loaded, _cart, _token]) => loaded),
      map(([_loaded, cart, token]) => {
        if (!token.access_token && !cart.user) {
          this.routingService.go({ route: ['guest'] });
        }
        return true;
      })
    );
  }
}
