import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../../auth/auth-service/auth.service';

@Injectable()
export class AccountGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  canActivate(): boolean {
    if (this.auth.getCurrentUser()) {
      return true;
    } else {
      this.auth.goToLogin();
      return false;
    }
  }
}
