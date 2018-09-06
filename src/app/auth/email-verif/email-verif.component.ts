import {Component} from '@angular/core';

import {AuthService} from '../auth-service/auth.service';
import {DicoService} from '../../language/dico.service';
import {Location} from '@angular/common';


@Component({
  selector: 'app-email-verif',
  templateUrl: './email-verif.component.html',
  styleUrls: ['./email-verif.component.css']
})
export class EmailVerifComponent {

  constructor(
    private auth: AuthService,

    public location: Location,
    public d: DicoService
  ) { }

  sendEmail() {
    this.auth.getUser()
      .first()
      .subscribe(user => this.auth.sendEmailVerification(user));
  }
}
