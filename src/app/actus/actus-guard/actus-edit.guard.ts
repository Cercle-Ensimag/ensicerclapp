import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

import {AuthService} from '../../auth/auth-service/auth.service';
import {Observable} from '../../../../node_modules/rxjs';

@Injectable()
export class CanActivateActusEdit implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return Observable.zip(
      this.auth.isAdminOf('actus'),
      this.auth.isJournalist()
    ).first()
      .map(([isAdminOfActus, b2]) => isAdminOfActus || b2)
      .do(is => {
        if (!is) {
          this.auth.goToHome();
        }
      });
  }
}
