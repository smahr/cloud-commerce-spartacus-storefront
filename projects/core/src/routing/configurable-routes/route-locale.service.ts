import { Injectable } from '@angular/core';
import { RoutesConfigLoader } from './routes-config-loader';
import { RoutesConfig } from './routes-config';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LanguageService } from '../../site-context';
import { UrlParsingService } from './url-translation/url-parsing.service';

@Injectable()
export class RouteLocaleService {
  constructor(
    private loader: RoutesConfigLoader,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private languageService: LanguageService,
    private urlParser: UrlParsingService
  ) {}

  private _currentRouteLocale: string;
  private _fallbackCurrentRouteLocale: string;
  get currentRouteLocale(): string {
    if (!this._currentRouteLocale) {
      this.initCurrentRouteLocale();
    }

    return this._currentRouteLocale;
  }

  // spike todo: the initial route locale should come from some source of truth like:
  // - route locale recognized in url - when many locales are used
  // - site-context locale (from language service)

  private initCurrentRouteLocale() {
    // spike todo maybe move this logic somewhere else:

    if (this.shouldLocaleBeInUrl()) {
      // if many locales are configured
      this.router.events.subscribe(event => {
        // spike todo: why NavigationEnt fires so many times event before page is loaded:
        if (event instanceof NavigationEnd) {
          const urlSegments = this.urlParser.getPrimarySegments(event.url);
          const firstUrlSegment = urlSegments[0];

          // if first url segment is one of configured valid route locales
          if (this.isValidRouteLocale(firstUrlSegment)) {
            this._currentRouteLocale = firstUrlSegment;
            debugger; //spike todo remove
          } else {
            // fallback to the first configured locale if no locale is present in the url
            this._currentRouteLocale = this._fallbackCurrentRouteLocale;
            debugger; //spike todo remove
          }
        }
      });

      // spike todo: in case its not ready yet:
      // this._fallbackCurrentRouteLocale = this.routeLocales[0];
      // spike todo check if it works! - if fallback is present at this moment!!

      // spike todo: there may be many fallback strategies: use locale from session
      // spike todo: assumption that active language is in one of configured languages
      this.languageService.getActive().subscribe(locale => {
        if (this.isValidRouteLocale(locale)) {
          this._fallbackCurrentRouteLocale = locale;
        } else {
          this._fallbackCurrentRouteLocale = this.routeLocales[0]; // if active langauge is not a valid route locale, use first configured route locale
        }
        debugger; //spike todo remove
      });
    } else {
      // if one or zero route locale is configured then route locale should be null
      this._currentRouteLocale = null;
    }
  }

  private isValidRouteLocale(text: string): boolean {
    return this.routeLocales.indexOf(text) !== -1;
  }

  get routeLocales(): RoutesConfig['translations']['useLocales'] {
    return this.loader.routesConfig.translations.useLocales;
  }

  get urlLocalePrefix(): string {
    return this.shouldLocaleBeInUrl() ? this.currentRouteLocale : '';
  }

  private shouldLocaleBeInUrl(): boolean {
    return Array.isArray(this.routeLocales); // if many locales in use, then prefix them with locale, for example /en/*
  }
}
