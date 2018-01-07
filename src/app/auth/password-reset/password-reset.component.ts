import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth-service/auth.service';
import { DicoService } from '../../language/dico.service';


@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  email_ctrl: FormControl;
  sent: boolean;
  email: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    public d: DicoService
  ) {
    this.sent = false;
    this.email_ctrl = new FormControl('', [Validators.required, Validators.email, this.auth.emailDomainValidator]);
  }

  ngOnInit() {
  }

  sendEmail() {
    if (!this.email_ctrl.invalid) {
      this.auth.sendPasswordResetEmail(this.email_ctrl.value);
      this.sent = true;
      this.email = this.email_ctrl.value;
    }
  }

  back() {
    this.router.navigateByUrl('/login');
  }
}
