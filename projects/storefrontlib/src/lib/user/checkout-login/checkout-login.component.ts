import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomFormValidators } from '../../ui/validators/custom-form-validators';
import {
  // CartDataService,
  CartService,
  AuthService
  // ClientToken
} from '@spartacus/core';
// import { switchMap, tap, take } from 'rxjs/operators';
// import { CartService } from '@spartacus/core';
@Component({
  selector: 'cx-checkout-login',
  templateUrl: './checkout-login.component.html',
  styleUrls: ['./checkout-login.component.scss']
})
export class CheckoutLoginComponent implements OnInit {
  form: FormGroup;

  // private userService: UserService,
  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    // private cartData: CartDataService,
    private cartService: CartService
  ) {}
  // private cartService: CartService

  ngOnInit() {
    this.form = this.fb.group({
      userId: ['', [Validators.required, CustomFormValidators.emailValidator]],
      userIdConf: [
        '',
        [Validators.required, CustomFormValidators.emailValidator]
      ],
      termsandconditions: [Validators.requiredTrue]
    });
  }

  submit() {
    const { userId, userIdConf, termsandconditions } = this.form.value;
    console.log('guest email', userId, userIdConf, termsandconditions);
    return this.auth.refreshClientToken().subscribe(token => {
      this.cartService.addEmailToCart(userId, token);
    });
  }
}
