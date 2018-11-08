
import {map, tap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';

import { AuthService } from '../../auth/auth-service/auth.service';




import {User} from 'firebase/app';

@Injectable()
export class CanActivateHome implements CanActivate {

  constructor(
    private auth: AuthService) { }

  canActivate(
    ) {
    return this.auth.getUser().pipe(
      tap((user: User) => {
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
