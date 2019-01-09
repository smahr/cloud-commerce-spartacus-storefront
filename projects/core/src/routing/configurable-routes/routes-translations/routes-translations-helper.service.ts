import { Injectable } from '@angular/core';
import { ServerConfig } from '../../../config/server-config/server-config';
import { RoutesTranslations, RouteTranslation } from '../routes-config';

@Injectable()
export class RoutesTranslationsHelperService {
  constructor(private config: ServerConfig) {}

  /**
   * Returns translation for given route name if it's defined in given object and if the object itself is defined too
   */
  getTranslation(
    routeName: string,
    routesTranslations: RoutesTranslations
  ): RouteTranslation {
    const result = routesTranslations && routesTranslations[routeName];
    if (!routesTranslations || result === undefined) {
      this.warn(
        `There is no route '${routeName}' in routes translations object '${routesTranslations}'!`
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
