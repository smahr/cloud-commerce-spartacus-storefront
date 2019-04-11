import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RoutingService, UserService, CheckoutService } from '@spartacus/core';

@Component({
  selector: 'cx-express-checkout',
  templateUrl: './express-checkout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpressCheckoutComponent {
  constructor(
    protected routingService: RoutingService,
    protected userService: UserService,
    protected checkoutService: CheckoutService
  ) {}

  expressCheckout() {
    this.routingService.go(['/checkout'], { express: true });
  }
}
