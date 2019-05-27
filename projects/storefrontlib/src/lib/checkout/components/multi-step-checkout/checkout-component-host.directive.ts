import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[cxCheckoutComponent]'
})
export class CheckoutComponentHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) {
  }

}
