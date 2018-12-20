import { Component, OnInit } from '@angular/core';
import {
  ConfigurableRoutesService,
  LanguageService,
  RouteLocaleService
} from '@spartacus/core';

@Component({
  selector: 'cx-storefront',
  templateUrl: './storefront.component.html',
  styleUrls: ['./storefront.component.scss']
})
export class StorefrontComponent implements OnInit {
  constructor(
    private configurableRoutesService: ConfigurableRoutesService,
    private languageService: LanguageService,
    private routeLocaleService: RouteLocaleService
  ) {}

  ngOnInit() {
    // spike todo: move this function call to other place:
    this.configurableRoutesService.init();

    // spike todo: move this subscription to other place:
    // spike todo: use current prefix of URL, if present - not content active language
    this.languageService.getActive().subscribe(locale => {
      this.routeLocaleService.setCurrentRouteLocale(locale);
    });
  }
}
