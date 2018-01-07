import { Component } from '@angular/core';

import { AuthService } from '../auth-service/auth.service';
import { DicoService } from '../../language/dico.service';


@Component({
  selector: 'app-email-verif',
  templateUrl: './email-verif.component.html',
  styleUrls: ['./email-verif.component.css']
})
export class EmailVerifComponent {

  constructor(
    private auth: AuthService,
    public d: DicoService
  ) { }

  sendEmail() {
    this.auth.sendEmailVerification(this.auth.getCurrentUser());
  }

  back() {
    this.auth.logout();
  }
}
