import { TestBed, async } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import * as fromRoot from './../../routing/store';
import * as fromStore from './../store';
import { of } from 'rxjs/observable/of';

const mockUserValidToken = {
  access_token: 'Mock Access Token'
};

const mockUserInvalidToken = {};

fdescribe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let store: Store<fromStore.UserState>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        providers: [AuthGuard],
        imports: [
          StoreModule.forRoot({
            ...fromRoot.reducers,
            user: combineReducers(fromStore.reducers)
          })
        ]
      });
    })
  );

  beforeEach(() => {
    authGuard = TestBed.get(AuthGuard);
    store = TestBed.get(Store);
  });

  it('should return false', () => {
    spyOn(store, 'select').and.returnValue(of(mockUserInvalidToken));
    spyOn(sessionStorage, 'getItem').and.returnValue(mockUserInvalidToken);

    let result: boolean;

    authGuard.canActivate().subscribe(value => (result = value));
    expect(result).toBe(false);
  });

  it('should return true', () => {
    spyOn(store, 'select').and.returnValue(of(mockUserValidToken));
    spyOn(sessionStorage, 'getItem').and.returnValue(mockUserValidToken);

    let result: boolean;

    authGuard.canActivate().subscribe(value => (result = value));
    expect(result).toBe(true);
  });
});
