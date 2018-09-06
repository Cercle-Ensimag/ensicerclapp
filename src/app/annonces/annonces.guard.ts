import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

import {AuthService} from '../auth/auth-service/auth.service';

@Injectable()
export class AnnoncesGuard implements CanActivate {

  constructor(
    private auth: AuthService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this.auth.isAdminOf('annonces')
      .first()
      .do(is => {
        if (!is) {
          this.auth.goToHome();
        }
      });
  }
}
