import { Injectable } from '@angular/core';
import { Routes, Router, Route } from '@angular/router';
import { ServerConfig } from '../../config/server-config/server-config';
import { RoutesConfigLoader } from './routes-config-loader';
import { RoutesTranslations, RoutesConfig } from './routes-config';
import { RoutesTranslationsService } from './routes-translations.service';
import { RouteLocaleService } from './route-locale.service';

type ConfigurableRouteKey = 'cxPath' | 'cxRedirectTo';

@Injectable()
export class ConfigurableRoutesService {
  constructor(
    private readonly config: ServerConfig,
    private readonly router: Router,
    private readonly loader: RoutesConfigLoader,
    private readonly routesTranslationsService: RoutesTranslationsService,
    private readonly routeLocaleService: RouteLocaleService
  ) {}

  private get routesTranslations(): RoutesConfig['translations'] {
    return this.loader.routesConfig.translations;
  }

  // spike todo improve name of method:

  init() {
    // spike todo rethink if string | string[] is good type for useLocales:
    const routeLocales = this.routeLocaleService.routeLocales;

    let newRouterConfig: Routes;

    if (Array.isArray(routeLocales)) {
      const translationsPerLocale = routeLocales.reduce((acc, locale) => {
        const translations = this.routesTranslationsService.getAllRoutesTranslationsForLocale(
          locale
        );
        return translations ? { ...acc, [locale]: translations } : acc;
      }, {});
      newRouterConfig = this.translateRoutesPerLocale(
        this.router.config,
        translationsPerLocale
      );
    } else if (typeof routeLocales === 'string') {
      const translations = this.routesTranslationsService.getAllRoutesTranslationsForLocale(
        routeLocales
      );
      newRouterConfig = this.translateRoutes(this.router.config, translations);
    } else {
      const translations = this.routesTranslations
        .default as RoutesTranslations;
      newRouterConfig = this.translateRoutes(this.router.config, translations);
    }

    console.log(newRouterConfig); // spike todo remove

    return this.router.resetConfig(newRouterConfig);
  }

  private translateRoutesPerLocale(
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
      path: locale,
      children: this.translateRoutes(
        routes,
        routesTranslationsPerLocale[locale]
      )
    }));
    return isLastRouteWildcard
      ? translatedRoutesPerLocale.concat(lastRoute)
      : translatedRoutesPerLocale;
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
      const childrenTranslations = this.routesTranslationsService.getChildrenRoutesTranslations(
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

  // spike todo: re-consider names of those 2 methods:
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
      '/' + this.routeLocaleService.getUrlCurrentLocalePrefix().join('/') + '/';

    return translatedPaths.length
      ? [{ ...route, redirectTo: siteContextUrlPefix + translatedPath }]
      : [];
  }

  private getTranslatedPaths(
    route: Route,
    key: ConfigurableRouteKey,
    routesTranslations: RoutesTranslations
  ): string[] {
    const routeName = this.getConfigurable(route, key);
    const translation = this.routesTranslationsService.getRouteTranslation(
      routeName,
      routesTranslations
    );
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
