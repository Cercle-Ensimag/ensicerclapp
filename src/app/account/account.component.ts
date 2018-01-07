import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { AuthService, Profile } from '../auth/auth-service/auth.service';
import { DicoService } from '../language/dico.service';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  email_ctrl: FormControl;
  password_ctrl: FormControl;
  first_ctrl: FormControl;
  last_ctrl: FormControl;
  login_ctrl: FormControl;

  deleteAccountDiv: boolean;
  hide: boolean;
  changePasswordDiv: boolean;

  constructor(
    public auth: AuthService,
    public d: DicoService
  ) {
    this.deleteAccountDiv = false;
    this.changePasswordDiv = false;
    this.hide = true;
  }

  ngOnInit() {
    this.email_ctrl = new FormControl(
      { value: this.auth.getCurrentUser().email, disabled: true },
      [Validators.required, Validators.email, this.auth.emailDomainValidator]
    );
    this.password_ctrl = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.first_ctrl = new FormControl(this.auth.profile.name.firstName, [Validators.required]);
    this.last_ctrl = new FormControl(this.auth.profile.name.lastName, [Validators.required]);
    this.login_ctrl = new FormControl(this.auth.profile.name.login, []);
  }

  updateProfile() {
    if(!this.first_ctrl.invalid && !this.last_ctrl.invalid && !this.login_ctrl.invalid){
      this.auth.updateProfile(new Profile(
        this.first_ctrl.value,
        this.last_ctrl.value,
        this.login_ctrl.value,
        ""
      ));
    }
  }

  back() {
    this.deleteAccountDiv = false;
    this.changePasswordDiv = false;
  }

  deleteAccount() {
    this.deleteAccountDiv = true;
  }

  newPassword() {
    this.changePasswordDiv = true;
  }

  confirmDeleteAccount() {
    this.auth.deleteAccount()
    .then(() => {
      this.auth.setError(this.d.l.accountDeletedInfo, true);
    })
    .catch(() => {
      this.auth.setError(this.d.l.refreshTokenInfo, true);
      this.auth.logout();
    })
  }

  confirmNewPassword() {
    if (!this.password_ctrl.invalid) {
      this.auth.updatePassword(this.password_ctrl.value)
      .then(() => {
        this.auth.setError(this.d.l.passwordChangedInfo, true);
        this.auth.logout();
      })
      .catch(() => {
        this.auth.setError(this.d.l.refreshTokenInfo, true);
        this.auth.goToLogin();
      })
    }
  }

}
