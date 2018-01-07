import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../auth-service/auth.service';
import { DicoService } from '../../language/dico.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginCtrl: FormGroup;
  hide = true;

  constructor(
    public auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    public d: DicoService
  ) {
    this.loginCtrl = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        this.auth.emailDomainValidator
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    })
  }

  getEmail(): string {
    return this.loginCtrl.get('email').value;
  }
  getPassword(): string {
    return this.loginCtrl.get('password').value;
  }

  ngOnInit() {
    this.auth.resetError();
    if (this.auth.getCurrentUser()){
      this.router.navigateByUrl('/home');
    }
  }

  onSubmit() {
    if(this.loginCtrl.valid){
      this.auth.login(this.getEmail(), this.getPassword());
    }
  }
}
