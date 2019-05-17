import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AuthService,
  GlobalMessageService,
  GlobalMessageType,
  RoutingService,
} from '@spartacus/core';
import { of, Subscription } from 'rxjs';
import { CustomFormValidators } from '../../../shared/utils/validators/custom-form-validators';
import { AuthRedirectService } from 'projects/core/src/auth/guards/auth-redirect.service';

@Component({
  selector: 'cx-login-form',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent implements OnInit, OnDestroy {
  sub: Subscription;
  form: FormGroup;

  constructor(
    private auth: AuthService,
    private globalMessageService: GlobalMessageService,
    private fb: FormBuilder,
    private redirectUrlService: AuthRedirectService
  ) {}

  ngOnInit() {
    this.sub = this.auth.getUserToken().subscribe(data => {
      debugger;
      if (data && data.access_token) {
        this.globalMessageService.remove(GlobalMessageType.MSG_TYPE_ERROR);
        this.redirectUrlService.go();
      }
    });

    this.form = this.fb.group({
      userId: ['', [Validators.required, CustomFormValidators.emailValidator]],
      password: ['', Validators.required],
    });
  }

  login(): void {
    this.auth.authorize(
      this.form.controls.userId.value,
      this.form.controls.password.value
    );
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
