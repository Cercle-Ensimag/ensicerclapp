import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AuthService} from '../auth-service/auth.service';
import {DicoService} from '../../language/dico.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public formGroup: FormGroup;
  public loading: boolean = false;
  public hide: boolean = true;

  constructor(
    private router: Router,
    private fb: FormBuilder,

    public auth: AuthService,
    public d: DicoService
  ) {
    this.formGroup = this.fb.group({
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

  ngOnInit() {
    this.auth.resetError();
    this.auth.getUser()
      .pipe(first())
      .subscribe(user => {
        if (user) {
          this.auth.goToHome()
        }
      });
  }

  submit() {
    this.loading = true;
    this.auth.login(this.formGroup.get('email').value, this.formGroup.get('password').value)
      .then(() => {
        this.auth.goToHome();
        this.loading = false;
      });
  }
}
