import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AuthService } from '../../auth/auth-service/auth.service';
import { zip } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';

@Injectable()
export class CanActivateEventsEdit implements CanActivate {

	constructor(private auth: AuthService) { }

	canActivate() {
		return zip(
			this.auth.isAdminOf('events'),
			this.auth.isRespCom()
		).pipe(
			first(),
			map(([admin, resp]) => admin || resp),
			tap(is => {
				if (!is) {
					this.auth.goToHome();
				}
			})
		);
	}
}
