import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import { AuthService } from '../../auth/auth-service/auth.service';

@Injectable()
export class CanActivateVoteAdmin implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this.auth.waitForAccessToXToBeSet('admins')
      .take(1)
      .map(auth => auth.isVoteAdmin)
      .do(is => {
        if (!is) {
          this.router.navigateByUrl('/home');
          return;
        }
      });
  }
}
