import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { map, tap } from 'rxjs/operators';

import { AuthService, SimpleUser } from '../../auth/auth-service/auth.service';


@Injectable()
export class CanActivateHome implements CanActivate {

	constructor(
		private auth: AuthService
	) { }

	canActivate() {
		return this.auth.getSimpleUser().pipe(
			tap((user: SimpleUser) => {
				if (!user) {
					this.auth.goToLogin();
					return;
				}
				if (!user.emailVerified) {
					this.auth.goToEmailVerif();
					return;
				}
			}),
			map(user => !!user)
		);
	}
}
