import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import { AuthService } from '../../auth/auth-service/auth.service';

@Injectable()
export class CanActivateHome implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.auth.getCurrentUser()) {
      this.router.navigateByUrl('/login');
      return false;
    }
    if (!this.auth.getCurrentUser().emailVerified) {
      this.router.navigateByUrl('/email_verif');
      return false;
    }
    return true;
  }
}
