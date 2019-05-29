import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartCouponComponent } from './cart-coupon.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApliedCouponsComponent } from './aplied-coupons/aplied-coupons.component';

@NgModule({
  declarations: [CartCouponComponent, ApliedCouponsComponent],
  exports: [CartCouponComponent, ApliedCouponsComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class CartCouponModule {}
