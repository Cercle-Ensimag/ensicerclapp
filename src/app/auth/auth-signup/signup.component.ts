import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../auth-service/auth.service';
import { DicoService } from '../../language/dico.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit {
  signUpCtrl: FormGroup;
  hide = true;

  constructor(
    public auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    public d: DicoService
  ) {
    this.signUpCtrl = this.fb.group({
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
    })
  }

  getFirstName(): string {
    return this.signUpCtrl.get('firstName').value;
  }
  getLastName(): string {
    return this.signUpCtrl.get('lastName').value;
  }
  getEmail(): string {
    return this.signUpCtrl.get('email').value;
  }
  getPassword(): string {
    return this.signUpCtrl.get('password').value;
  }

  ngOnInit() {
    this.auth.resetError();
    if (this.auth.getCurrentUser()){
      this.router.navigateByUrl('/home');
    }
  }

  onSubmit() {
    if(this.signUpCtrl.valid){
      this.auth.createAccount(
        this.getEmail(),
        this.getPassword(),
        this.getFirstName(),
        this.getLastName()
      );
    }
  }
}
