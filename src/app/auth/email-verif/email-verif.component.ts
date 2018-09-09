import {Component, OnDestroy} from '@angular/core';

import {AuthService} from '../auth-service/auth.service';
import {DicoService} from '../../language/dico.service';
import {Location} from '@angular/common';
import {Subject} from 'rxjs/Subject';


@Component({
  selector: 'app-email-verif',
  templateUrl: './email-verif.component.html',
  styleUrls: ['./email-verif.component.css']
})
export class EmailVerifComponent implements OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private auth: AuthService,

    public location: Location,
    public d: DicoService
  ) { }

  ngOnInit() {
    this.auth.getLoggedUser()
      .takeUntil(this.unsubscribe)
      .subscribe(user => {
        if (user.emailVerified) this.auth.goToHome();
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  sendEmail() {
    this.auth.getUser()
      .first()
      .subscribe(user => this.auth.sendEmailVerification(user));
  }
}
