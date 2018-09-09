import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';

import {AuthService} from '../../auth-service/auth.service';
import {Observable} from '../../../../../node_modules/rxjs';
import {User} from 'firebase/app';

@Injectable()
export class EmailVerifGuard implements CanActivate {

  constructor(
    private auth: AuthService,
  ) { }

  canActivate(): Observable<boolean> {
    return this.auth.getUser()
      .map((user: User) => !(user && user.emailVerified))
      .do(isNotVerified => {
        if (!isNotVerified) {
          this.auth.goToLogin();
        }
      });
  }
}
