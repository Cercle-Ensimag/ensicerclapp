import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';

import {AuthService} from '../../auth-service/auth.service';
import {Observable} from 'rxjs';
import {User} from 'firebase/app';
import {map, tap} from 'rxjs/operators';

@Injectable()
export class EmailVerifGuard implements CanActivate {

  constructor(
    private auth: AuthService,
  ) { }

  canActivate(): Observable<boolean> {
    return this.auth.getUser().pipe(
      map((user: User) => !(user && user.emailVerified)),
      tap(isNotVerified => {
        if (!isNotVerified) {
          this.auth.goToLogin();
        }
      }));
  }
}
