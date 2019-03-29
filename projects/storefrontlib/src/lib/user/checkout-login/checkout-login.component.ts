import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomFormValidators } from '../../ui/validators/custom-form-validators';
import { CartService, AuthService } from '@spartacus/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cx-checkout-login',
  templateUrl: './checkout-login.component.html',
  styleUrls: ['./checkout-login.component.scss'],
})
export class CheckoutLoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  clientTokenSubscription: Subscription;
  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      userId: ['', [Validators.required, CustomFormValidators.emailValidator]],
      userIdConf: [
        '',
        [Validators.required, CustomFormValidators.emailValidator],
      ],
      termsandconditions: [Validators.requiredTrue],
    });
  }

  submit(): void {
    const { userId, userIdConf, termsandconditions } = this.form.value;
    console.log('guest email', userId, userIdConf, termsandconditions);
    this.clientTokenSubscription = this.auth
      .refreshClientToken()
      .subscribe(token => {
        this.cartService.addEmailToCart(userId, token);
      });
  }

  ngOnDestroy(): void {
    if (this.clientTokenSubscription) {
      this.clientTokenSubscription.unsubscribe();
    }
  }
}
