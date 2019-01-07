import { Injectable } from '@angular/core';
import { RoutesConfigLoader } from './routes-config-loader';
import { RoutesConfig } from './routes-config';
import { UrlParsingService } from './url-translation/url-parsing.service';

@Injectable()
export class RouteLocaleService {
  constructor(
    private routesConfigLoader: RoutesConfigLoader,
    private urlParser: UrlParsingService
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

  private getInitialRouteLocale(): string {
    if (Array.isArray(this.validRouteLocales)) {
      if (this.validRouteLocales.length > 1) {
        return this.detectRouteLocaleDynamically();
      }
      if (this.validRouteLocales.length === 1) {
        return this.validRouteLocales[0];
      }
    }
    // if no locales are configured then current route locale should be null
    return null;
  }

  private detectRouteLocaleDynamically(): string {
    const currentUrl = window.location.pathname; // SPIKE TODO: check how to make it work with SSR (without window object)!
    const urlSegments = this.urlParser.getPrimarySegments(currentUrl);
    const routeLocaleFromUrl = urlSegments[0]; // spike todo improve it when more url context parameters are made configurable in future

    return this.isValidRouteLocale(routeLocaleFromUrl)
      ? routeLocaleFromUrl
      : this.validRouteLocales[0]; // fallback to the first configured locale if the route locale in the url is not valid
  }

  private isValidRouteLocale(text: string): boolean {
    return this.validRouteLocales.indexOf(text) !== -1;
  }

  shouldUrlContainRouteLocale(): boolean {
    // if many route locales are in use, prefixevery url with the locale, for example /en/*
    return (
      Array.isArray(this.validRouteLocales) && this.validRouteLocales.length > 1
    );
  }
}
