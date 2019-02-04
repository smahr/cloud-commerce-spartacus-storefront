import { Component, ChangeDetectionStrategy } from '@angular/core';

import { CartService, RoutingService } from '@spartacus/core';

import { tap, filter } from 'rxjs/operators';

@Component({
  selector: 'cx-test-login',
  templateUrl: './test-login.component.html',
  styleUrls: ['./test-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestLoginComponent {
  email: string;

  constructor(
    private cart: CartService,
    private routingService: RoutingService
  ) {}

  send(): void {
    this.cart.addEmail(this.email);
    this.cart
      .getLoaded()
      .pipe(
        filter(loaded => loaded),
        tap(() => {
          this.routingService.go({ route: ['checkout'] });
        })
      )
      .subscribe();
  }
}
