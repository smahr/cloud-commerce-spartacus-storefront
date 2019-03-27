import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { CurrentProductService } from '../../../../ui/pages/product-page/current-product.service';
import { ProductDetailOutlets } from '../../../product-outlets.model';
import { Product } from '@spartacus/types';

@Component({
  selector: 'cx-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  static outlets = ProductDetailOutlets;

  @Output() openReview = new EventEmitter();

  product$: Observable<Product>;

  get outlets() {
    return ProductDetailsComponent.outlets;
  }

  constructor(protected currentPageService: CurrentProductService) {}

  ngOnInit(): void {
    this.product$ = this.currentPageService.getProduct();
  }

  launchReview() {
    this.openReview.emit();
  }
}
