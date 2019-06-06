import { NgModule } from '@angular/core';
import { HamburgerMenuModule } from '../layout/index';
import { CartComponentModule } from './cart/cart.module';
import { CheckoutComponentModule } from './checkout/checkout.module';
import {
  BannerModule,
  CmsParagraphModule,
  LinkModule,
  TabParagraphContainerModule,
} from './content/index';
import { SiteContextSelectorModule } from './misc/index';
import {
  AddressBookModule,
  CloseAccountModule,
  ConsentManagementModule,
  ForgotPasswordModule,
  OrderDetailsModule,
  OrderHistoryModule,
  PaymentMethodsModule,
  ResetPasswordModule,
  UpdateEmailModule,
  UpdatePasswordModule,
  UpdateProfileModule,
} from './myaccount/index';
import {
  BreadcrumbModule,
  CategoryNavigationModule,
  FooterNavigationModule,
  NavigationModule,
  SearchBoxModule,
} from './navigation/index';
import {
  ProductCarouselModule,
  ProductListModule,
  ProductReferencesModule,
  ProductTabsModule,
} from './product/index';
import { ProductImagesModule } from './product/product-images/product-images.module';
import { OrderConfirmationModule } from './order-confirmation/index';
import { MerchandisingCarouselModule } from './product/carousel/merchandising-carousel/merchandising-carousel.module';

@NgModule({
  imports: [
    HamburgerMenuModule,
    CmsParagraphModule,
    LinkModule,
    BannerModule,
    CategoryNavigationModule,
    NavigationModule,
    FooterNavigationModule,
    BreadcrumbModule,
    SearchBoxModule,
    SiteContextSelectorModule,
    AddressBookModule,
    OrderHistoryModule,
    ProductListModule,
    ProductTabsModule,
    ProductCarouselModule,
    MerchandisingCarouselModule,
    ProductReferencesModule,
    OrderDetailsModule,
    PaymentMethodsModule,
    UpdateEmailModule,
    UpdatePasswordModule,
    UpdateProfileModule,
    ConsentManagementModule,
    CloseAccountModule,
    CartComponentModule,
    TabParagraphContainerModule,
    OrderConfirmationModule,
    // TODO:#2811 - uncomment to enable
    // StoreFinderModule,
    ProductImagesModule,
    CheckoutComponentModule,
    ForgotPasswordModule,
    ResetPasswordModule,
  ],
})
export class CmsLibModule { }
