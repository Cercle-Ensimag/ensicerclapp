import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AuthService} from '../auth-service/auth.service';
import {DicoService} from '../../language/dico.service';
import {Location} from '@angular/common';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit {
  private unsubscribe: Subject<void> = new Subject();

  public formGroup: FormGroup;
  public hidePassword: boolean = true;

  constructor(
    private fb: FormBuilder,

    public auth: AuthService,
    public location: Location,
    public d: DicoService
  ) {
    this.formGroup = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [
        Validators.required,
        Validators.email,
        this.auth.emailDomainValidator
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  ngOnInit() {
    this.auth.resetError();
    this.auth.isLogged()
      .takeUntil(this.unsubscribe)
      .subscribe(is => {
        if (is) this.auth.goToHome();
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  submit() {
    if(this.formGroup.valid){
      this.auth.createAccount(
        this.formGroup.get('email').value,
        this.formGroup.get('password').value,
        this.formGroup.get('firstName').value,
        this.formGroup.get('lastName').value
      );
    }
  }
}
