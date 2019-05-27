import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CheckoutConfig } from '../config/checkout-config';
import { RoutingService } from '@spartacus/core';
import { tap } from 'rxjs/operators';
@Component({
  selector: 'cx-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBarComponent implements OnInit {
  steps: Array<any>;
  activeStepIndex: number;
  activeStepUrl: string;
  currentStepIndex: any;
  nextStepIndex: any;

  constructor(
    protected config: CheckoutConfig,
    protected routingService: RoutingService
  ) { }

  ngOnInit() {
    this.steps = this.config.steps;
    this.currentStepIndex = 0;
    this.nextStepIndex = 1;
    this.routingService
      .getRouterState()
      .pipe(
        tap(router => {
          this.activeStepUrl = router.state.context.id;
          console.log('1# ' + this.activeStepUrl);
          this.steps.forEach((step, index) => {
            console.log('2# ' + step.url);
            if (step.url === this.activeStepUrl) {
              this.activeStepIndex = index;
            }
          });
        })
      )
      .subscribe();
  }

  nextStep(step: any): void {
    console.log('go to next step:' + this.steps[step].label);
    this.currentStepIndex = step;
    if (step < this.steps.length - 1) {
      this.nextStepIndex = step + 1;
    }
  }
}
