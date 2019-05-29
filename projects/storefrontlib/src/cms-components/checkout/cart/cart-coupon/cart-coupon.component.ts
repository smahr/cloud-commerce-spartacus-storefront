import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  OccEndpointsService,
  AuthService,
  Cart,
  Order,
  CartService,
} from '@spartacus/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'cx-cart-coupon',
  templateUrl: './cart-coupon.component.html',
})
export class CartCouponComponent implements OnInit {
  form: FormGroup;
  vouchers$: Observable<any>;

  @Input()
  cart: Cart | Order;
  @Input()
  guid: string;

  userId: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private occEndpoints: OccEndpointsService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      couponCode: ['', [Validators.required]],
    });
    this.authService
      .getUserToken()
      .pipe(map(token => token.userId))
      .subscribe(userId => (this.userId = userId));
  }

  apply(): void {
    const params = new HttpParams().set(
      'voucherId',
      this.form.value.couponCode
    );
    this.http
      .post(this.getEndpoint(this.userId, this.cart.code), {}, { params })
      .subscribe(() => this.cartService.loadDetails());
  }

  getEndpoint(userId: string, cartId: string): string {
    const endpoint = `/users/${userId}/carts/${cartId}/vouchers`;
    return this.occEndpoints.getEndpoint(endpoint);
  }
}
