import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import { AuthService } from '../../auth/auth-service/auth.service';

@Injectable()
export class CanActivateActusEdit implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (!this.auth.isActusAdmin && !this.auth.isComResp) {
      this.router.navigateByUrl('/home');
      return false;
    } else {
      return true;
    }
  }
}
