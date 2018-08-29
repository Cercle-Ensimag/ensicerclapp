import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import { AuthService } from '../../auth/auth-service/auth.service';
import {Observable} from '../../../../node_modules/rxjs';

@Injectable()
export class CanActivateEventsEdit implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return Observable.zip(
      this.auth.waitForAccessToXToBeSet('admins'),
      this.auth.waitForAccessToXToBeSet('comResps'),
      (auth: AuthService, _) => auth
    ).take(1)
      .map(auth => auth.isComResp || auth.isEventsAdmin)
      .do(is => {
        if (!is) {
          this.router.navigateByUrl('/home');
          return;
        }
      });
  }
}
