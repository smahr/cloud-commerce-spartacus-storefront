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

  private get routesTranslations(): RoutesConfig['translations'] {
    return this.loader.routesConfig.translations;
  }

  private get currentRoutesTranslations(): RoutesTranslations {
    return (this.routeLocaleService.currentRouteLocale
      ? this.routesTranslations.locales[
          this.routeLocaleService.currentRouteLocale
        ]
      : this.routesTranslations.default) as RoutesTranslations;
  }

  // spike todo find better names to distinquis methods getRoutesTranslationsForLocale, getDefaultRoutesTranslations, getRoutesTranslations (for nested routes)
  getByLocale(locale: string): RoutesTranslations {
    const translations = this.routesTranslations.locales[locale];
    if (!translations) {
      this.warn(
        `There are no translations in routes config for locale '${locale}'`
      );
    }
    return translations as RoutesTranslations;
  }

  getDefault(): RoutesTranslations {
    return this.routesTranslations.default as RoutesTranslations;
  }

  getByNestedRoutesNames(
    nestedRouteNames: string[],
    routesTranslations: RoutesTranslations = this.currentRoutesTranslations
  ): RouteTranslation[] {
    return this.getByNestedRoutesNamesRecursive(
      nestedRouteNames,
      routesTranslations,
      []
    );
  }

  private getByNestedRoutesNamesRecursive(
    nestedRoutesNames: string[],
    routesTranslations: RoutesTranslations,
    accResult: RouteTranslation[]
  ): RouteTranslation[] {
    if (!nestedRoutesNames.length) {
      return accResult;
    }
    const [routeName, ...remainingRouteNames] = nestedRoutesNames;
    const translation = this.getByRouteName(routeName, routesTranslations);
    if (!translation) {
      return null;
    }

    if (remainingRouteNames.length) {
      const childrenTranslations = this.getChildrenRoutesTranslations(
        routeName,
        routesTranslations
      );
      if (!childrenTranslations) {
        this.warn(
          `No children routes translations were configured for page '${routeName}' in locale '${
            this.routeLocaleService.currentRouteLocale // spike todo check if currentLocale is used here implicit
          }'!`
        );
        return null;
      }

      return this.getByNestedRoutesNamesRecursive(
        remainingRouteNames,
        childrenTranslations,
        accResult.concat(translation)
      );
    }
    return accResult.concat(translation);
  }

  // spike todo: consider if this method should be public and if it's really neded
  getChildrenRoutesTranslations(
    routeName: string,
    routesTranslations: RoutesTranslations
  ): RoutesTranslations {
    const routeTranslation = this.getByRouteName(routeName, routesTranslations);
    return routeTranslation && routeTranslation.children;
  }

  // spike todo: consider if this method should be public and if it's really neded
  getByRouteName(
    routeName: string,
    routesTranslations: RoutesTranslations
  ): RouteTranslation {
    const result = routesTranslations && routesTranslations[routeName];
    if (!routesTranslations || result === undefined) {
      this.warn(
        `No route translation was configured for page '${routeName}' in locale '${
          this.routeLocaleService.currentRouteLocale // spike todo check if currentLocale is used here implicit
        }'!`
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
