import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import { AuthService } from '../../auth/auth-service/auth.service';

@Injectable()
export class CanActivateCafetAdmin implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this.auth.isAdminOf('cafet')
      .first()
      .do(is => {
        if (!is) {
          this.auth.goToHome();
        }
      });
  }
}