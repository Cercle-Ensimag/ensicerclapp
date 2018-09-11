import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';

import {AuthService} from '../../auth/auth-service/auth.service';
import {zip} from 'rxjs';
import {first, map, tap} from 'rxjs/operators';

@Injectable()
export class CanActivateActusEdit implements CanActivate {

  constructor(private auth: AuthService) {
  }

  canActivate(
    ) {
    return zip(
      this.auth.isAdminOf('actus'),
      this.auth.isJournalist()
    ).pipe(
      first(),
      map(([isAdminOfActus, b2]) => isAdminOfActus || b2),
      tap(is => {
        if (!is) {
          this.auth.goToHome();
        }
      }));
  }
}
