import { TestBed } from '@angular/core/testing';
import { RoutesConfigLoader } from '../routes-config-loader';
import { Location } from '@angular/common';
import { RouteLocaleService } from './route-locale.service';
import { Router, NavigationEnd } from '@angular/router';
import { UrlParsingService } from '../url-translation/url-parsing.service';
import { BehaviorSubject } from 'rxjs';

class MockRoutesConfigLoader {
  get routesConfig() {
    return {};
  }
}

const mockEnglishUrl = 'en/url';
const mockGermanUrl = 'de/url';
const mockInvalidLocaleUrl = 'invalid-locale/url';
const mockEmptyUrl = '';

describe('RouteLocaleService', () => {
  let service: RouteLocaleService;
  let routesConfigLoader: RoutesConfigLoader;
  let location: Location;
  let mockRouterEvents: BehaviorSubject<NavigationEnd>;

  beforeEach(() => {
    mockRouterEvents = new BehaviorSubject<NavigationEnd>(
      new NavigationEnd(null, null, mockEmptyUrl)
    );

    const mockUrlParsingService = {
      getPrimarySegments(url: string) {
        if (url === mockEnglishUrl) {
          return ['en', 'url'];
        } else if (url === mockGermanUrl) {
          return ['de', 'url'];
        } else if (url === mockInvalidLocaleUrl) {
          return ['invalid-locale', 'url'];
        } else if (url === mockEmptyUrl) {
          return [];
        } else {
          return undefined;
        }
      }
    };

    TestBed.configureTestingModule({
      providers: [
        RouteLocaleService,
        { provide: RoutesConfigLoader, useClass: MockRoutesConfigLoader },
        { provide: Router, useValue: { events: mockRouterEvents } },
        { provide: UrlParsingService, useValue: mockUrlParsingService },
        { provide: Location, useValue: { path: () => {} } }
      ]
    });

    service = TestBed.get(RouteLocaleService);
    routesConfigLoader = TestBed.get(RoutesConfigLoader);
    location = TestBed.get(Location);
  });

  describe('validRouteLocales', () => {
    it('should return configured locales for routes', () => {
      spyOnProperty(routesConfigLoader, 'routesConfig').and.returnValue({
        translations: { useLocale: ['en', 'de'] }
      });
      expect(service.validRouteLocales).toEqual(['en', 'de']);
    });
  });

  describe('shouldUrlContainRouteLocale', () => {
    it('should return true when there are more than one configured route locales', () => {
      spyOnProperty(routesConfigLoader, 'routesConfig').and.returnValue({
        translations: { useLocale: ['en', 'de'] }
      });
      expect(service.shouldUrlContainRouteLocale()).toEqual(true);
    });

    it('should return false when there is only than one configured route locale', () => {
      spyOnProperty(routesConfigLoader, 'routesConfig').and.returnValue({
        translations: { useLocale: ['en'] }
      });
      expect(service.shouldUrlContainRouteLocale()).toEqual(false);
    });

    it('should return false when there are no configured route locales', () => {
      spyOnProperty(routesConfigLoader, 'routesConfig').and.returnValue({
        translations: { useLocale: [] }
      });
      expect(service.shouldUrlContainRouteLocale()).toEqual(false);
    });

    it('should return false when configured route locales equal null', () => {
      spyOnProperty(routesConfigLoader, 'routesConfig').and.returnValue({
        translations: { useLocale: null }
      });
      expect(service.shouldUrlContainRouteLocale()).toEqual(false);
    });
  });

  describe('currentRouteLocale', () => {
    it('should return null when there are no configured route locales', () => {
      spyOnProperty(routesConfigLoader, 'routesConfig').and.returnValue({
        translations: { useLocale: null }
      });
      expect(service.currentRouteLocale).toBe(null);
    });

    it('should return the single route locale when only this one was configured', () => {
      spyOnProperty(routesConfigLoader, 'routesConfig').and.returnValue({
        translations: { useLocale: ['en'] }
      });
      expect(service.currentRouteLocale).toBe('en');
    });

    describe(', when more than one route locale were configured, ', () => {
      beforeEach(() => {
        spyOnProperty(routesConfigLoader, 'routesConfig').and.returnValue({
          translations: { useLocale: ['en', 'de'] }
        });
      });

      it('should return locale from current url', () => {
        spyOn(location, 'path').and.returnValue(mockGermanUrl);
        expect(service.currentRouteLocale).toBe('de');
      });

      it('should return previous valid value when current url does not contain valid locale', () => {
        service['_currentRouteLocale'] = 'en';
        spyOn(location, 'path').and.returnValue(mockInvalidLocaleUrl);
        expect(service.currentRouteLocale).toBe('en');
      });

      it('should return first configured locale when there is no previous value and current url does not contain valid locale', () => {
        service['_currentRouteLocale'] = undefined;
        spyOn(location, 'path').and.returnValue(mockInvalidLocaleUrl);
        expect(service.currentRouteLocale).toBe('en');
      });

      it('should return first configured locale when there is no previous value and current url is empty', () => {
        service['_currentRouteLocale'] = undefined;
        spyOn(location, 'path').and.returnValue(mockEmptyUrl);
        expect(service.currentRouteLocale).toBe('en');
      });

      it('should update value when URL changes and it contains a valid locale', () => {
        spyOn(location, 'path').and.returnValues(mockEnglishUrl);

        expect(service.currentRouteLocale).toBe('en');
        mockRouterEvents.next(new NavigationEnd(null, null, mockGermanUrl));
        expect(service.currentRouteLocale).toBe('de');
      });

      it('should not update value when URL changes and it does NOT contain a valid locale', () => {
        spyOn(location, 'path').and.returnValues(mockEnglishUrl);

        expect(service.currentRouteLocale).toBe('en');
        mockRouterEvents.next(
          new NavigationEnd(null, null, mockInvalidLocaleUrl)
        );
        expect(service.currentRouteLocale).toBe('en');
      });

      it('should not update value when URL changes to empty path', () => {
        spyOn(location, 'path').and.returnValues(mockEnglishUrl);

        expect(service.currentRouteLocale).toBe('en');
        mockRouterEvents.next(new NavigationEnd(null, null, mockEmptyUrl));
        expect(service.currentRouteLocale).toBe('en');
      });
    });
  });
});
