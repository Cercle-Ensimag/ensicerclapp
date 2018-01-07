import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { AuthService } from '../auth-service/auth.service';
import { DicoService } from '../../language/dico.service';

const TITLE: string = "Registration";
const BUTTON_LABEL: string = "Sign Up!";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit {
  email_ctrl: FormControl;
  password_ctrl: FormControl;
  first_ctrl: FormControl;
  last_ctrl: FormControl;

  hide = true;

  constructor(
    public auth: AuthService,
    private router: Router,
    public d: DicoService
  ) {
    this.email_ctrl = new FormControl('', [Validators.required, Validators.email, this.auth.emailDomainValidator]);
    this.password_ctrl = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.first_ctrl = new FormControl('', [Validators.required]);
    this.last_ctrl = new FormControl('', [Validators.required]);
  }

  ngOnInit() {
    this.auth.resetError();
    if (this.auth.getCurrentUser()){
      this.router.navigateByUrl('/home');
    }
  }

  onSubmit() {
    if(
      !this.email_ctrl.invalid && !this.password_ctrl.invalid &&
      !this.first_ctrl.invalid && !this.last_ctrl.invalid
    ){
      this.auth.createAccount(
        this.email_ctrl.value,
        this.password_ctrl.value,
        this.first_ctrl.value,
        this.last_ctrl.value
      );
    }
  }
}
