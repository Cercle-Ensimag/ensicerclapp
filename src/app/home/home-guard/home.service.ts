import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import { AuthService } from '../../auth/auth-service/auth.service';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Injectable()
export class CanActivateHome implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this.auth.getAuthState()
    .take(1)
    .map(authState => !!authState)
    .do(authenticated => {
      if (!authenticated) {
        this.router.navigateByUrl('/login');
        return;
      }
      if (!this.auth.getCurrentUser().emailVerified) {
        this.router.navigateByUrl('/email_verif');
      }
    });
  }
}
