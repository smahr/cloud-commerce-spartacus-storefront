import { Injectable } from '@angular/core';
import { RoutesConfigLoader } from './routes-config-loader';
import { UrlParsingService } from './url-translation/url-parsing.service';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable()
export class RouteLocaleService {
  constructor(
    private routesConfigLoader: RoutesConfigLoader,
    private urlParser: UrlParsingService,
    private location: Location,
    private router: Router
  ) {}

  private _currentRouteLocale: string;
  get currentRouteLocale(): string {
    if (!this._currentRouteLocale) {
      this._currentRouteLocale = this.getInitialRouteLocale();
    }
    return this._currentRouteLocale;
  }

  get validRouteLocales(): string[] {
    return this.routesConfigLoader.routesConfig.translations.useLocale;
  }

  // spike todo: update the current route location after every location change (in case of navigation to url with other locale)
  private getInitialRouteLocale(): string {
    if (Array.isArray(this.validRouteLocales)) {
      if (this.validRouteLocales.length > 1) {
        this.updateCurrentRouteLocaleOnEveryRouteChange();

        // use Location service not to wait for the initialization of the router.url (which is `/` on the initial application's render)
        return this.getRouteLocaleFromUrl(this.location.path()); // SPIKE TODO: check if Location.path() works with SSR!
      }
      if (this.validRouteLocales.length === 1) {
        return this.validRouteLocales[0];
      }
    }
    // if no locales are configured then current route locale should be null
    return null;
  }

  private updateCurrentRouteLocaleOnEveryRouteChange() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this._currentRouteLocale = this.getRouteLocaleFromUrl(
          event.urlAfterRedirects
        );
      });
  }

  private getRouteLocaleFromUrl(url: string): string {
    const urlSegments = this.urlParser.getPrimarySegments(url);
    const routeLocaleFromUrl = urlSegments[0]; // spike todo improve it when more url context parameters are made configurable in future

    return this.isValidRouteLocale(routeLocaleFromUrl)
      ? routeLocaleFromUrl
      : // if the route locale in the URL is not valid, fallback to the previous value of currentRouteLocale
        // if there are no previous value, just get the first configured locale by convention
        this._currentRouteLocale || this.validRouteLocales[0];
  }

  private isValidRouteLocale(text: string): boolean {
    return this.validRouteLocales.indexOf(text) !== -1;
  }

  shouldUrlContainRouteLocale(): boolean {
    // if many route locales are in use, prefix every url with the locale, for example /en/*
    return (
      Array.isArray(this.validRouteLocales) && this.validRouteLocales.length > 1
    );
  }
}
