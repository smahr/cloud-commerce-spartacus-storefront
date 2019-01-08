import { Injectable } from '@angular/core';
import { ServerConfig } from '../../config/server-config/server-config';
import { RoutesConfigLoader } from './routes-config-loader';
import {
  RoutesTranslations,
  RouteTranslation,
  RoutesConfig
} from './routes-config';
import { RouteLocaleService } from './route-locale.service';

@Injectable()
export class RoutesTranslationsService {
  constructor(
    private readonly config: ServerConfig,
    private readonly loader: RoutesConfigLoader,
    private readonly routeLocaleService: RouteLocaleService
  ) {}

  private get allRoutesTranslations(): RoutesConfig['translations'] {
    return this.loader.routesConfig.translations;
  }

  private get currentRoutesTranslations(): RoutesTranslations {
    return (this.routeLocaleService.currentRouteLocale
      ? this.allRoutesTranslations.locales[
          this.routeLocaleService.currentRouteLocale
        ]
      : this.allRoutesTranslations.default) as RoutesTranslations;
  }

  /**
   * Returns all routes translations for the given locale
   */
  getAllForLocale(locale: string): RoutesTranslations {
    const translations = this.allRoutesTranslations.locales[locale];
    if (!translations) {
      this.warn(
        `There are no translations in routes config for locale '${locale}'`
      );
    }
    return translations as RoutesTranslations;
  }

  /**
   * Returns all default routes translations
   */
  getAllDefault(): RoutesTranslations {
    return this.allRoutesTranslations.default as RoutesTranslations;
  }

  /**
   * Returns the sequence of routes translations for the given sequence of nested routes
   */
  getForNestedRoutesSequence(
    nestedRoutesNames: string[],
    routesTranslations: RoutesTranslations = this.currentRoutesTranslations
  ): RouteTranslation[] {
    return this.getForNestedRoutesSequenceRecursive(
      nestedRoutesNames,
      routesTranslations,
      []
    );
  }

  private getForNestedRoutesSequenceRecursive(
    nestedRoutesNames: string[],
    routesTranslations: RoutesTranslations,
    accResult: RouteTranslation[]
  ): RouteTranslation[] {
    if (!nestedRoutesNames.length) {
      return accResult;
    }
    const [routeName, ...remainingRouteNames] = nestedRoutesNames;
    const translation = this.getForRoute(routeName, routesTranslations);
    if (!translation) {
      return null;
    }

    if (remainingRouteNames.length) {
      const routeTranslation = this.getForRoute(routeName, routesTranslations);
      const childrenTranslations =
        routeTranslation && routeTranslation.children;
      if (!childrenTranslations) {
        this.warn(
          `There are children for route '${routeName}' in routes translations '${routesTranslations}'!`
        );
        return null;
      }

      return this.getForNestedRoutesSequenceRecursive(
        remainingRouteNames,
        childrenTranslations,
        accResult.concat(translation)
      );
    }
    return accResult.concat(translation);
  }

  /**
   * Returns the route translation for the given route name
   */
  getForRoute(
    routeName: string,
    routesTranslations: RoutesTranslations
  ): RouteTranslation {
    const result = routesTranslations && routesTranslations[routeName];
    if (!routesTranslations || result === undefined) {
      this.warn(
        `There is no route '${routeName}' in routes translations '${routesTranslations}'!`
      );
    }
    return result;
  }

  private warn(...args) {
    if (!this.config.production) {
      console.warn(...args);
    }
  }
}
