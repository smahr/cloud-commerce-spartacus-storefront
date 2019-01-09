import { Injectable } from '@angular/core';
import { ServerConfig } from '../../../config/server-config/server-config';
import { RoutesConfigLoader } from '../routes-config-loader';
import {
  RoutesTranslations,
  RouteTranslation,
  RoutesConfig
} from '../routes-config';
import { RouteLocaleService } from '../route-locale/route-locale.service';
import { RoutesTranslationsHelperService } from './routes-translations-helper.service';

@Injectable()
export class RoutesTranslationsService {
  constructor(
    private readonly config: ServerConfig,
    private readonly loader: RoutesConfigLoader,
    private readonly routeLocaleService: RouteLocaleService,
    private readonly routesTranslationsHelper: RoutesTranslationsHelperService
  ) {}

  private get allRoutesTranslations(): RoutesConfig['translations'] {
    return this.loader.routesConfig.translations;
  }

  // spike todo: improve name of this property
  // it returns translations that should be used to generate links in current page
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
  getRoutesTranslationsForLocale(locale: string): RoutesTranslations {
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
  getDefaultRoutesTranslations(): RoutesTranslations {
    return this.allRoutesTranslations.default as RoutesTranslations;
  }

  /**
   * Returns the sequence of routes translations for the given sequence of nested routes
   */
  getCurrentRoutesTranslationsForNestedRoutesSequence(
    nestedRoutesNames: string[]
  ): RouteTranslation[] {
    return this.getRoutesTranslationsForNestedRoutesSequenceRecursive(
      nestedRoutesNames,
      this.currentRoutesTranslations,
      []
    );
  }

  private getRoutesTranslationsForNestedRoutesSequenceRecursive(
    nestedRoutesNames: string[],
    routesTranslations: RoutesTranslations,
    accResult: RouteTranslation[]
  ): RouteTranslation[] {
    if (!nestedRoutesNames.length) {
      return accResult;
    }
    const [routeName, ...remainingRouteNames] = nestedRoutesNames;
    const translation = this.routesTranslationsHelper.getTranslation(
      routeName,
      routesTranslations
    );

    // if there is no configured translation for some route in the sequence, return null for whole sequence:
    if (!translation) {
      return null;
    }

    if (remainingRouteNames.length) {
      const routeTranslation = this.routesTranslationsHelper.getTranslation(
        routeName,
        routesTranslations
      );
      const childrenTranslations =
        routeTranslation && routeTranslation.children;

      // if there are no configured children translations for some route in the middle of the sequence, return null for whole sequence:
      if (!childrenTranslations) {
        this.warn(
          `There are children for route '${routeName}' in routes translations '${routesTranslations}'!`
        );
        return null;
      }

      return this.getRoutesTranslationsForNestedRoutesSequenceRecursive(
        remainingRouteNames,
        childrenTranslations,
        accResult.concat(translation)
      );
    }
    return accResult.concat(translation);
  }

  private warn(...args) {
    if (!this.config.production) {
      console.warn(...args);
    }
  }
}
