import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';

import {AuthService} from '../../auth/auth-service/auth.service';
import {first, tap} from 'rxjs/operators';

@Injectable()
export class CanActivateAdmin implements CanActivate {

  constructor(
    private auth: AuthService,
  ) {
  }

  canActivate(
    ) {
    return this.auth.isAdmin().pipe(
      first(),
      tap(is => {
        if (!is) {
          this.auth.goToHome();
        }
      }));
  }
}
