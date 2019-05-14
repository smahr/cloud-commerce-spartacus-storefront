import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CartService, Cart } from '@spartacus/core';
import { CheckoutDetailsService } from '../../../checkout-details.service';

import { Observable } from 'rxjs';
@Component({
  selector: 'cx-new-checkout-container',
  templateUrl: './new-checkout-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCheckoutContainerComponent implements OnInit {
  cart$: Observable<Cart>;

  constructor(
    public checkoutDetailsService: CheckoutDetailsService,
    protected cartService: CartService
  ) {}

  ngOnInit() {
    this.cart$ = this.cartService.getActive();
  }
}
