import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';

import {AuthService} from '../../auth/auth-service/auth.service';

@Injectable()
export class CanActivateAssessor implements CanActivate {

  constructor(private auth: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this.auth.isAssessor()
      .first()
      .do(is => {
        if (!is) {
          this.auth.goToHome();
        }
      });
  }
}
