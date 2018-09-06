import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

import {AuthService} from '../../auth/auth-service/auth.service';

@Injectable()
export class CanActivateJournalist implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this.auth.isJournalist()
      .first()
      .do(is => {
        if (!is) {
          this.auth.goToHome();
        }
      });
  }
}
