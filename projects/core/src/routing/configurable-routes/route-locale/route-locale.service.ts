import { Injectable } from '@angular/core';
import { RoutesConfigLoader } from '../routes-config-loader';
import { UrlParsingService } from '../url-translation/url-parsing.service';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class RouteLocaleService {
  private _currentRouteLocale: string;

  constructor(
    private routesConfigLoader: RoutesConfigLoader,
    private urlParser: UrlParsingService,
    private location: Location,
    private router: Router
  ) {}

  /**
   * The locale that should be used do generate links in current page using routes configuration
   */
  get currentRouteLocale(): string {
    if (this._currentRouteLocale === undefined) {
      this._currentRouteLocale = this.getInitialRouteLocale();
    }
    return this._currentRouteLocale;
  }

  /**
   * The list of locales that should can used to generate links
   */
  get validRouteLocales(): string[] {
    return this.routesConfigLoader.routesConfig.translations.useLocale;
  }

  /**
   * Returns true when generated links should contain locale, false otherwise
   */
  shouldUrlContainRouteLocale(): boolean {
    // if many route locales are in use, prefix every url with a locale, for example /en/*
    return (
      Array.isArray(this.validRouteLocales) && this.validRouteLocales.length > 1
    );
  }

  private getInitialRouteLocale(): string {
    if (Array.isArray(this.validRouteLocales)) {
      if (this.validRouteLocales.length > 1) {
        this.updateCurrentRouteLocaleOnCurrentUrlChange();
        return this.getRouteLocaleFromUrl(this.location.path());
      }
      if (this.validRouteLocales.length === 1) {
        return this.validRouteLocales[0];
      }
    }
    return null;
  }

  private updateCurrentRouteLocaleOnCurrentUrlChange() {
    this.localeInCurrentRoute$.subscribe(locale => {
      this._currentRouteLocale = locale;
    });
  }

  private get localeInCurrentRoute$(): Observable<string> {
    return this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: NavigationEnd) =>
        this.getRouteLocaleFromUrl(event.urlAfterRedirects)
      )
    );
  }

  private getRouteLocaleFromUrl(url: string): string {
    const urlSegments = this.urlParser.getPrimarySegments(url);
    const routeLocaleFromUrl = urlSegments[0];

    return this.isValidRouteLocale(routeLocaleFromUrl)
      ? routeLocaleFromUrl
      : // if the route locale in the URL is not valid, fallback to the previous value of currentRouteLocale
        // or if there is no previous value, just get the configured default route locale
        this._currentRouteLocale || this.validRouteLocales[0];
  }

  private isValidRouteLocale(text: string): boolean {
    return this.validRouteLocales.indexOf(text) !== -1;
  }
}
