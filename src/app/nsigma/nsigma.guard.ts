import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../auth/auth-service/auth.service';

@Injectable()
export class NsigmaGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (!this.auth.isNsigmaAdmin) {
      this.router.navigateByUrl('/home');
      return false;
    } else {
      return true;
    }
  }

}
