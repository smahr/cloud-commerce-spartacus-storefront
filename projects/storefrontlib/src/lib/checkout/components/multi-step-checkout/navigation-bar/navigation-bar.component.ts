import { Component, OnInit } from '@angular/core';
import { CheckoutConfig } from '../config/checkout-config';
@Component({
  selector: 'cx-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css'],
})
export class NavigationBarComponent implements OnInit {
  steps: Array<any>;

  constructor(protected config: CheckoutConfig) {}
  ngOnInit() {
    this.steps = this.config.steps;
  }
}
