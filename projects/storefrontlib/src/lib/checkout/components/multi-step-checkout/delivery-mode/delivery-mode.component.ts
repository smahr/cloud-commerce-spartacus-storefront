import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { DeliveryMode, CheckoutService, RoutingService } from '@spartacus/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckoutConfig } from '../../../config/checkout-config';
import { Router } from '@angular/router';

@Component({
  selector: 'cx-delivery-mode',
  templateUrl: './delivery-mode.component.html',
  styleUrls: ['./delivery-mode.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryModeComponent implements OnInit {
  @Output()
  goToStep = new EventEmitter<number>();

  supportedDeliveryModes$: Observable<DeliveryMode[]>;
  selectedDeliveryMode$: Observable<DeliveryMode>;
  currentDeliveryModeId: string;
  goTo = null;

  mode: FormGroup = this.fb.group({
    deliveryModeId: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private checkoutService: CheckoutService,
    protected routingService: RoutingService,
    protected config: CheckoutConfig,
    protected router: Router
  ) {}

  ngOnInit() {
    this.checkoutService.loadSupportedDeliveryModes();

    this.supportedDeliveryModes$ = this.checkoutService.getSupportedDeliveryModes();
    this.selectedDeliveryMode$ = this.checkoutService.getSelectedDeliveryMode();

    this.selectedDeliveryMode$
      .pipe(
        map((deliveryMode: DeliveryMode) =>
          deliveryMode && deliveryMode.code ? deliveryMode.code : null
        )
      )
      .subscribe(code => {
        if (code) {
          this.mode.controls['deliveryModeId'].setValue(code);
          this.currentDeliveryModeId = code;
        }
        if (this.goTo === true) {
          this.nextStep();
          this.goTo = null;
        }
      });
  }

  nextStep() {
    const currentUrl = this.router.url;
    let currentIndex = 0;
    this.config.checkout.steps.forEach((step, index) => {
      if (currentUrl.includes(step.url)) {
        currentIndex = index;
      }
    });
    this.routingService.go([this.config.checkout.steps[currentIndex + 1].url]);
  }

  prevStep() {
    const currentUrl = this.router.url;
    let currentIndex = 0;
    this.config.checkout.steps.forEach((step, index) => {
      if (currentUrl.includes(step.url)) {
        currentIndex = index;
      }
    });
    this.routingService.go([this.config.checkout.steps[currentIndex - 1].url]);
  }

  next(): void {
    this.setDeliveryMode(this.mode.value.deliveryModeId);
    this.goTo = true;
  }

  back(): void {
    this.prevStep();
  }

  get deliveryModeInvalid(): boolean {
    return this.mode.controls['deliveryModeId'].invalid;
  }

  private setDeliveryMode(deliveryModeId: string): void {
    if (
      !this.currentDeliveryModeId ||
      this.currentDeliveryModeId !== deliveryModeId
    ) {
      this.checkoutService.setDeliveryMode(deliveryModeId);
    } else {
      this.nextStep();
    }
  }
}
