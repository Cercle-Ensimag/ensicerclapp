import {Component, OnDestroy} from '@angular/core';
import {Location} from '@angular/common';
import {User} from 'firebase/app';

import {AuthService} from '../auth-service/auth.service';
import {DicoService} from '../../language/dico.service';

import {Observable} from 'rxjs';
import {first, tap} from 'rxjs/operators';

@Component({
  selector: 'app-email-verif',
  templateUrl: './email-verif.component.html',
  styleUrls: ['./email-verif.component.css']
})
export class EmailVerifComponent {

	private _user: User;
	private _userObs: Observable<User>;

  constructor(
    private auth: AuthService,
    public location: Location,
    public d: DicoService
  ) { }

  ngOnInit() {
    this.auth.getUser().pipe(
			first()
		).toPromise().then(
			user => {
				if (!user) {
					this.auth.goToLogin();
					return;
				}
				this.auth.logout();
				if (user.emailVerified) {
					this.auth.goToLogin();
					return;
				}
				this._user = user;
			}
		);
  }

  sendEmail() {
    this.auth.sendEmailVerification(this._user);
  }

	goToLogin() {
		this.auth.goToLogin();
	}
}
