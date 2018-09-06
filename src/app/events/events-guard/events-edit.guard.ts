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
      this.auth.isAdminOf('events'),
      this.auth.isRespCom()
    ).first()
      .map(([isAdminOfEvents, b2]) => isAdminOfEvents || b2)
      .do(is => {
        if (!is) {
          this.auth.goToHome();
        }
      });
  }
}
