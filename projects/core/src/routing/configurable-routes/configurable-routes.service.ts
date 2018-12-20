import { Injectable } from '@angular/core';
import { Routes, Router, Route } from '@angular/router';
import { ServerConfig } from '../../config/server-config/server-config';
import { RoutesConfigLoader } from './routes-config-loader';
import {
  RoutesTranslations,
  RouteTranslation,
  RoutesConfig
} from './routes-config';

type ConfigurableRouteKey = 'cxPath' | 'cxRedirectTo';

@Injectable()
export class ConfigurableRoutesService {
  constructor(
    private readonly config: ServerConfig,
    private readonly router: Router,
    private readonly loader: RoutesConfigLoader
  ) {}

  private currentLocale: string;

  private get routesTranslations(): RoutesConfig['translations'] {
    return this.loader.routesConfig.translations;
  }

  private get currentRoutesTranslations(): RoutesTranslations {
    return (this.currentLocale
      ? this.routesTranslations.locales[this.currentLocale]
      : this.routesTranslations.default) as RoutesTranslations;
  }

  // spike todo improve name of method:
  private get configuredRouteLocales(): RoutesConfig['translations']['useLocales'] {
    return this.loader.routesConfig.translations.useLocales;
  }

  translateRouterConfig() {
    // spike todo rethink if string | string[] is good type for useLocales:
    if (!this.currentLocale) {
      this.currentLocale = Array.isArray(this.configuredRouteLocales)
        ? this.configuredRouteLocales[0] // spike todo reconsider it and document it: first language is used as default
        : this.configuredRouteLocales;
    }

    let newRouterConfig: Routes;

    if (Array.isArray(this.configuredRouteLocales)) {
      const translationsPerLocale = this.configuredRouteLocales.reduce(
        (acc, locale) => {
          const translations = this.getRoutesTranslationsForLocale(locale);
          return translations ? { ...acc, [locale]: translations } : acc;
        },
        {}
      );
      newRouterConfig = this.translateMultiLocalesRoutes(
        this.router.config,
        translationsPerLocale
      );
    } else if (typeof this.configuredRouteLocales === 'string') {
      const translations = this.getRoutesTranslationsForLocale(
        this.configuredRouteLocales
      );
      newRouterConfig = this.translateRoutes(this.router.config, translations);
    } else {
      const translations = this.routesTranslations
        .default as RoutesTranslations;
      newRouterConfig = this.translateRoutes(this.router.config, translations);
    }

    return this.router.resetConfig(newRouterConfig);
  }

  private getRoutesTranslationsForLocale(locale: string): RoutesTranslations {
    const translations = this.routesTranslations.locales[locale];
    if (!translations) {
      this.warn(
        `There are no translations in routes config for locale '${locale}'`
      );
    }
    return translations as RoutesTranslations;
  }

  setCurrentLocale(locale: string) {
    if (this.getRoutesTranslationsForLocale(locale)) {
      this.currentLocale = locale;
    }
  }

  private shouldUrlHaveLocalePrefix(): boolean {
    return Array.isArray(this.configuredRouteLocales); // if many locales in use, then prefix them with locale, for example /en/*
  }

  getUrlCurrentLocalePrefix(): string[] {
    return this.shouldUrlHaveLocalePrefix() ? [this.currentLocale] : [];
  }

  // spike todo move method to other service:
  getNestedRoutesTranslations(
    nestedRouteNames: string[],
    routesTranslations: RoutesTranslations = this.currentRoutesTranslations
  ): RouteTranslation[] {
    return this.getNestedRoutesTranslationsRecursive(
      nestedRouteNames,
      routesTranslations,
      []
    );
  }

  // spike todo move method to other service:
  private getNestedRoutesTranslationsRecursive(
    nestedRoutesNames: string[],
    routesTranslations: RoutesTranslations,
    accResult: RouteTranslation[]
  ): RouteTranslation[] {
    if (!nestedRoutesNames.length) {
      return accResult;
    }
    const [routeName, ...remainingRouteNames] = nestedRoutesNames;
    const translation = this.getRouteTranslation(routeName, routesTranslations);
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
            this.currentLocale // spike todo check if currentLocale is used here implicit
          }'!`
        );
        return null;
      }

      return this.getNestedRoutesTranslationsRecursive(
        remainingRouteNames,
        childrenTranslations,
        accResult.concat(translation)
      );
    }
    return accResult.concat(translation);
  }

  // spike todo move method to other service:
  private getChildrenRoutesTranslations(
    routeName: string,
    routesTranslations: RoutesTranslations
  ): RoutesTranslations {
    const routeTranslation = this.getRouteTranslation(
      routeName,
      routesTranslations
    );
    return routeTranslation && routeTranslation.children;
  }

  private translateMultiLocalesRoutes(
    routes: Routes,
    routesTranslationsPerLocale: {
      [locale: string]: RoutesTranslations;
    }
  ): Routes {
    // spike todo draft:
    // assumption: wildcard!
    const lastRoute = routes[routes.length - 1];
    const isLastRouteWildcard = lastRoute.path === '**';
    if (isLastRouteWildcard) {
      routes.splice(-1, 1); // remove last route from list
    }

    // translate all routes under and nest under locale routes:
    const translatedRoutesPerLocale: Routes = Object.keys(
      routesTranslationsPerLocale
    ).map(locale => ({
      path: locale, // parent route will have locale
      children: this.translateRoutes(
        routes,
        routesTranslationsPerLocale[locale]
      ),
      data: { __cxRouteLocale: locale } // spike todo take care of not localized routes
    }));
    const result = isLastRouteWildcard
      ? translatedRoutesPerLocale.concat(lastRoute)
      : translatedRoutesPerLocale;

    // spike todo remove
    console.log(result);
    return result;
  }

  private translateRoutes(
    routes: Routes,
    routesTranslations: RoutesTranslations
  ): Routes {
    const result = [];
    routes.forEach(route => {
      const translatedRouteAliases = this.translateRoute(
        route,
        routesTranslations
      );
      if (route.children && route.children.length) {
        const translatedChildrenRoutes = this.translateChildrenRoutes(
          route,
          routesTranslations
        );
        translatedRouteAliases.forEach(translatedRouteAlias => {
          translatedRouteAlias.children = translatedChildrenRoutes;
        });
      }
      result.push(...translatedRouteAliases);
    });
    return result;
  }

  private translateChildrenRoutes(
    route: Route,
    routesTranslations: RoutesTranslations
  ): Routes {
    if (this.isConfigurable(route, 'cxPath')) {
      const routeName = this.getConfigurable(route, 'cxPath');
      const childrenTranslations = this.getChildrenRoutesTranslations(
        routeName,
        routesTranslations
      );

      if (childrenTranslations === undefined) {
        this.warn(
          `Could not translate children routes of route '${routeName}'`,
          route,
          `due to undefined 'children' key for '${routeName}' route in routes translations`,
          routesTranslations
        );
        return [];
      }

      // null switches off the children routes:
      if (childrenTranslations === null) {
        return [];
      }
      return this.translateRoutes(route.children, childrenTranslations);
    }
    return null;
  }

  private translateRoute(
    route: Route,
    routesTranslations: RoutesTranslations
  ): Routes {
    if (this.isConfigurable(route, 'cxPath')) {
      // we assume that 'path' and 'redirectTo' cannot be both configured for one route
      if (this.isConfigurable(route, 'cxRedirectTo')) {
        this.warn(
          `A path should not have set both "cxPath" and "cxRedirectTo" properties! Route: '${route}`
        );
      }
      return this.translateRoutePath(route, routesTranslations);
    }

    if (this.isConfigurable(route, 'cxRedirectTo')) {
      return this.translateRouteRedirectTo(route, routesTranslations);
    }

    return [route]; // if nothing is configurable, just pass the original route
  }

  private isConfigurable(route: Route, key: ConfigurableRouteKey): boolean {
    return !!this.getConfigurable(route, key);
  }

  private getConfigurable(route: Route, key: ConfigurableRouteKey): string {
    return route.data && route.data[key];
  }

  private translateRoutePath(
    route: Route,
    routesTranslations: RoutesTranslations
  ): Route[] {
    return this.getTranslatedPaths(route, 'cxPath', routesTranslations).map(
      translatedPath => {
        return { ...route, path: translatedPath };
      }
    );
  }

  private translateRouteRedirectTo(
    route: Route,
    translations: RoutesTranslations
  ): Route[] {
    const translatedPaths = this.getTranslatedPaths(
      route,
      'cxRedirectTo',
      translations
    );
    const translatedPath = translatedPaths[0]; // take the first path from list by convention

    // spike todo make it cleaner:
    const siteContextUrlPefix =
      '/' + this.getUrlCurrentLocalePrefix().join('/') + '/';

    return translatedPaths.length
      ? [{ ...route, redirectTo: siteContextUrlPefix + translatedPath }]
      : [];
  }

  // spike todo move method to other service:
  private getRouteTranslation(
    routeName: string,
    routesTranslations: RoutesTranslations
  ): RouteTranslation {
    const result = routesTranslations && routesTranslations[routeName];
    if (!routesTranslations || result === undefined) {
      this.warn(
        `No route translation was configured for page '${routeName}' in locale '${
          this.currentLocale // spike todo check if currentLocale is used here implicit
        }'!`
      );
    }
    return result;
  }

  private getTranslatedPaths(
    route: Route,
    key: ConfigurableRouteKey,
    routesTranslations: RoutesTranslations
  ): string[] {
    const routeName = this.getConfigurable(route, key);
    const translation = this.getRouteTranslation(routeName, routesTranslations);
    if (translation === undefined) {
      this.warn(
        `Could not translate key '${key}' of route '${routeName}'`,
        route,
        `due to undefined key '${routeName}' in routes translations`,
        routesTranslations
      );
      return [];
    }
    if (translation && translation.paths === undefined) {
      this.warn(
        `Could not translate key '${key}' of route '${routeName}'`,
        route,
        `due to undefined 'paths' key for '${routeName}' route in routes translations`,
        routesTranslations
      );
      return [];
    }

    // translation or translation.paths can be null - which means switching off the route
    return (translation && translation.paths) || [];
  }

  private warn(...args) {
    if (!this.config.production) {
      console.warn(...args);
    }
  }
}
