import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApliedCouponsComponent } from './aplied-coupons.component';

describe('ApliedCouponsComponent', () => {
  let component: ApliedCouponsComponent;
  let fixture: ComponentFixture<ApliedCouponsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ApliedCouponsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApliedCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
