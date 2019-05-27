import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartCouponComponent } from './cart-coupon.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CartCouponComponent],
  exports: [CartCouponComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CartCouponModule { }
