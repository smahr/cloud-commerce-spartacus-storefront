import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCheckoutContainerComponent } from './new-checkout-container.component';

describe('NewCheckoutContainerComponent', () => {
  let component: NewCheckoutContainerComponent;
  let fixture: ComponentFixture<NewCheckoutContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCheckoutContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCheckoutContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
