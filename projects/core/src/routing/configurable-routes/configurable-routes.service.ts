import { Injectable } from '@angular/core';
import { Routes, Router, Route } from '@angular/router';
import { ServerConfig } from '../../config/server-config/server-config';
import { RoutesTranslations } from './routes-config';
import { RoutesTranslationsService } from './routes-translations/routes-translations.service';
import { RouteLocaleService } from './route-locale/route-locale.service';
import { partition } from './utils/partition';
import { RoutesTranslationsHelperService } from './routes-translations/routes-translations-helper.service';

type ConfigurableRouteKey = 'cxPath' | 'cxRedirectTo';

@Injectable()
export class ConfigurableRoutesService {
  constructor(
    private readonly config: ServerConfig,
    private readonly router: Router,
    private readonly routesTranslationsService: RoutesTranslationsService,
    private readonly routesTranslationsHelper: RoutesTranslationsHelperService,
    private readonly routeLocaleService: RouteLocaleService
  ) {}

  init() {
    const {
      wildcardRoutes,
      configurableRoutes,
      nonConfigurableRoutes
    } = this.partitionRoutes(this.router.config);

    const newRouterConfig = this.configureRoutes(
      configurableRoutes,
      this.routeLocaleService.validRouteLocales
    ).concat(nonConfigurableRoutes, wildcardRoutes);

    this.router.resetConfig(newRouterConfig);
  }

  private partitionRoutes(
    routes: Routes
  ): {
    wildcardRoutes: Routes;
    configurableRoutes: Routes;
    nonConfigurableRoutes: Routes;
  } {
    const [wildcardRoutes, nonWildcardRoutes] = partition(
      routes,
      route => route.path === '**'
    );

    const [configurableRoutes, nonConfigurableRoutes] = partition(
      nonWildcardRoutes,
      route =>
        this.isConfigurable(route, 'cxPath') ||
        this.isConfigurable(route, 'cxRedirectTo')
    );

    return {
      wildcardRoutes,
      configurableRoutes,
      nonConfigurableRoutes
    };
  }

  private configureRoutes(routes: Routes, validRouteLocales: string[]): Routes {
    if (Array.isArray(validRouteLocales)) {
      if (validRouteLocales.length > 1) {
        return this.configureRoutesForManyLocales(routes, validRouteLocales);
      }
      if (validRouteLocales.length === 1) {
        return this.configureRoutesForOneLocale(routes, validRouteLocales[0]);
      }
    }
    return this.configureRoutesForDefault(routes);
  }

  private configureRoutesForManyLocales(
    routes: Routes,
    validRouteLocales: string[]
  ): Routes {
    return validRouteLocales.map(locale => {
      const routesTranslations = this.routesTranslationsService.getRoutesTranslationsForLocale(
        locale
      );

      // nest translated routes as children of the artificial locale route:
      return {
        path: locale,
        children: this.translateRoutes(routes, routesTranslations, locale)
      };
    });
  }

  private configureRoutesForOneLocale(
    routes: Routes,
    routeLocale: string
  ): Routes {
    const translations = this.routesTranslationsService.getRoutesTranslationsForLocale(
      routeLocale
    );
    return this.translateRoutes(routes, translations, null);
  }

  private configureRoutesForDefault(routes: Routes) {
    const translations = this.routesTranslationsService.getDefaultRoutesTranslations();
    return this.translateRoutes(routes, translations, null);
  }

  private translateRoutes(
    routes: Routes,
    routesTranslations: RoutesTranslations,
    routeLocale: string
  ): Routes {
    const result = [];
    routes.forEach(route => {
      const translatedRouteAliases = this.translateRoute(
        route,
        routesTranslations,
        routeLocale
      );
      if (route.children && route.children.length) {
        const translatedChildrenRoutes = this.translateChildrenRoutes(
          route,
          routesTranslations,
          routeLocale
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
    routesTranslations: RoutesTranslations,
    routeLocale: string
  ): Routes {
    if (this.isConfigurable(route, 'cxPath')) {
      const routeName = this.getConfigurable(route, 'cxPath');
      const routeTranslation = this.routesTranslationsHelper.getTranslation(
        routeName,
        routesTranslations
      );
      const childrenTranslations =
        routeTranslation && routeTranslation.children;

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
      return this.translateRoutes(
        route.children,
        childrenTranslations,
        routeLocale
      );
    }
    return null;
  }

  private translateRoute(
    route: Route,
    routesTranslations: RoutesTranslations,
    routeLocale: string
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
      return this.translateRouteRedirectTo(
        route,
        routesTranslations,
        routeLocale
      );
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
    translations: RoutesTranslations,
    routeLocale: string
  ): Route[] {
    const translatedPaths = this.getTranslatedPaths(
      route,
      'cxRedirectTo',
      translations
    );
    let translatedPath = '/' + translatedPaths[0]; // take the first path from list (by convention) and make it absolute

    if (this.routeLocaleService.shouldUrlContainRouteLocale()) {
      translatedPath = '/' + routeLocale + translatedPath;
    }

    return translatedPaths.length
      ? [{ ...route, redirectTo: translatedPath }]
      : [];
  }

  private getTranslatedPaths(
    route: Route,
    key: ConfigurableRouteKey,
    routesTranslations: RoutesTranslations
  ): string[] {
    const routeName = this.getConfigurable(route, key);
    const translation = this.routesTranslationsHelper.getTranslation(
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
