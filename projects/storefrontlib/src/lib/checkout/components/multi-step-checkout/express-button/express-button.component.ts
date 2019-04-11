import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RoutingService } from '@spartacus/core';

@Component({
  selector: 'cx-express-button',
  templateUrl: './express-button.component.html',
  styleUrls: ['./express-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpressButtonComponent {
  constructor(protected routingService: RoutingService) {}

  expressCheckout() {
    this.routingService.go(['/checkout'], { express: true });
  }
}
