import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageNotFoundModule } from './404/404.module';
import { AddressBookPageModule } from './address-book-page/address-book-page.module';
import { CartPageModule } from './cart-page/cart-page.module';
import { CategoryPageModule } from './category-page/category-page.module';
import { ContactPageModule } from './contact-page/contact-page.module';
import { HelpPageModule } from './help-page/help-page.module';
import { HomePageModule } from './home-page/home-page.module';
import { LoginPageModule } from './login-page/login-page.module';
import { MultiStepCheckoutPageModule } from './multi-step-checkout-page/multi-step-checkout-page.module';
import { OrderConfirmationPageModule } from './order-confirmation-page/order-confirmation-page.module';
import { OrderDetailsPageModule } from './order-details-page/order-details-page.module';
import { OrderHistoryPageModule } from './order-history-page/order-history-page.module';
import { PaymentDetailsPageModule } from './payment-details-page/payment-details-page.module';
import { ProductPageModule } from './product-page/product-page.module';
import { RegisterPageModule } from './register-page/register-page.module';
import { ResetNewPasswordPageModule } from './reset-new-password-page/reset-new-password-page.module';
import { ResetPasswordPageModule } from './reset-password-page/reset-password-page.module';
import { SalePageModule } from './sale-page/sale-page.module';
import { StoreFinderPageModule } from './store-finder-page/store-finder-page.module';
import { TermsConditionsPageModule } from './terms-conditions-page/terms-conditions-page.module';
import { TestLoginModule } from './test-login/test-login.module';

const pageModules = [
  OrderHistoryPageModule,
  HomePageModule,
  CategoryPageModule,
  CartPageModule,
  MultiStepCheckoutPageModule,
  OrderDetailsPageModule,
  OrderConfirmationPageModule,
  AddressBookPageModule,
  ProductPageModule,
  RegisterPageModule,
  LoginPageModule,
  PaymentDetailsPageModule,
  ResetPasswordPageModule,
  StoreFinderPageModule,
  ContactPageModule,
  SalePageModule,
  HelpPageModule,
  ResetNewPasswordPageModule,
  TermsConditionsPageModule,
  TestLoginModule,
  // new pages should be added above this line
  PageNotFoundModule
];

@NgModule({
  imports: [CommonModule, ...pageModules],
  exports: [...pageModules]
})
export class PagesModule {}
