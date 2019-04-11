import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import {
  RoutingService,
  UserService,
  CheckoutService,
  AuthService,
  CartDataService,
} from '@spartacus/core';

@Component({
  selector: 'cx-express-checkout',
  templateUrl: './express-checkout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpressCheckoutComponent implements OnInit {
  ngOnInit(): void {
    this.userService.loadAddresses(this.cartService.userId);
    this.userService.loadPaymentMethods(this.cartService.userId);
    this.userService.getAddresses().subscribe(addresses => {
      if (addresses && addresses.length) {
        const defaultAddresses = addresses.filter(
          address => address.defaultAddress
        );
        if (defaultAddresses) {
          this.checkoutService.setDeliveryAddress(defaultAddresses[0]);
        }
      }
    });

    this.userService.getPaymentMethods().subscribe(paymentMethods => {
      if (paymentMethods && paymentMethods.length) {
        const defaultPaymentMethods = paymentMethods.filter(
          method => method.defaultPayment
        );
        if (defaultPaymentMethods) {
          this.checkoutService.setPaymentDetails(defaultPaymentMethods[0]);
        }
      }
    });
  }
  constructor(
    protected routingService: RoutingService,
    protected userService: UserService,
    protected checkoutService: CheckoutService,
    protected cartService: CartDataService
  ) {}
}
