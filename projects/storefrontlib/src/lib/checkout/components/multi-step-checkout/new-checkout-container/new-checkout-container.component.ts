import { Component, OnInit, ViewChild, ComponentFactoryResolver, AfterViewChecked } from '@angular/core';
import { CartService, Cart } from '@spartacus/core';
import { CheckoutDetailsService } from '../../../checkout-details.service';
import { CheckoutConfig } from '../config/checkout-config';

import { Observable } from 'rxjs';
import { CheckoutComponentHostDirective } from '../checkout-component-host.directive';
@Component({
  selector: 'cx-new-checkout-container',
  templateUrl: './new-checkout-container.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCheckoutContainerComponent implements OnInit, AfterViewChecked {
  cart$: Observable<Cart>;
  currentStepIndex: any;
  components: Array<any>;

  @ViewChild(CheckoutComponentHostDirective) componentHost: CheckoutComponentHostDirective;


  constructor(
    public checkoutDetailsService: CheckoutDetailsService,
    protected cartService: CartService,
    protected config: CheckoutConfig,
    private componentFactoryResolver: ComponentFactoryResolver,
    private dynamicComponentLoader: DynamicComponentLoader
  ) { }

  ngOnInit() {
    this.cart$ = this.cartService.getActive();
    this.components = this.config.components;
    this.currentStepIndex = 0;

  }

  ngAfterViewChecked() {

    this.currentStepIndex = 0;
    const component = this.components[this.currentStepIndex];


    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);

    const viewContainerRef = this.componentHost.viewContainerRef;
    viewContainerRef.clear();

    viewContainerRef.createComponent(componentFactory);

  }
}
