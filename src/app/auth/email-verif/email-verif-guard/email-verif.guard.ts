import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../../auth-service/auth.service';

@Injectable()
export class EmailVerifGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  canActivate(): boolean {
    if (this.auth.getCurrentUser() && !this.auth.getCurrentUser().emailVerified) {
      return true;
    } else {
      this.auth.goToLogin();
      return false;
    }
  }
}
