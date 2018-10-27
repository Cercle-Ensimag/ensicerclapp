import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';

import {AuthService} from '../auth/auth-service/auth.service';
import {first, tap} from 'rxjs/operators';

@Injectable()
export class JobAdsGuard implements CanActivate {

  constructor(
    private auth: AuthService
  ) {
  }

  canActivate(
    ) {
    return this.auth.isAdminOf('jobads').pipe(
      first(),
      tap(is => {
        if (!is) {
          this.auth.goToHome();
        }
      }));
  }
}
