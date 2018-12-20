import { Injectable } from '@angular/core';
import { RoutesConfigLoader } from './routes-config-loader';
import { RoutesConfig } from './routes-config';

@Injectable()
export class RouteLocaleService {
  constructor(private readonly loader: RoutesConfigLoader) {}

  private _currentRouteLocale: string;

  get currentRouteLocale(): string {
    if (!this._currentRouteLocale) {
      this.initCurrentRouteLocale();
    }

    return this._currentRouteLocale;
  }

  private initCurrentRouteLocale() {
    this._currentRouteLocale = Array.isArray(this.routeLocales)
      ? this.routeLocales[0] // spike todo reconsider it and document it: first locale is used as default
      : this.routeLocales;
  }

  setCurrentRouteLocale(locale: string) {
    this._currentRouteLocale = locale;
  }

  get routeLocales(): RoutesConfig['translations']['useLocales'] {
    return this.loader.routesConfig.translations.useLocales;
  }

  getUrlCurrentLocalePrefix(): string[] {
    return this.shouldUrlHaveLocalePrefix() ? [this.currentRouteLocale] : [];
  }

  private shouldUrlHaveLocalePrefix(): boolean {
    return Array.isArray(this.routeLocales); // if many locales in use, then prefix them with locale, for example /en/*
  }
}
