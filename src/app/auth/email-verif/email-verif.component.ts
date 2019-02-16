import {Component, OnDestroy} from '@angular/core';
import {Location} from '@angular/common';
import {User} from 'firebase/app';
import {MatSnackBar} from '@angular/material';

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
		public d: DicoService,
		private snackBar: MatSnackBar
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

	getInfoMessage() {
		return this.d.format(
			this.d.l.verificationEmailSentInfo,
			this._user ? this._user.email : ""
		);
	}

	sendEmail() {
		this.auth.sendEmailVerification(this._user).then(
			() => this.snackBar.open(
				this.d.format(this.d.l.emailSentToInfo, this._user.email),
				this.d.l.okLabel,
				{duration: 2000}
			)
		);
	}

	goToLogin() {
		this.auth.goToLogin();
	}
}
