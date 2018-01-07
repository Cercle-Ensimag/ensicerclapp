import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { CafetService } from '../cafet-service/cafet.service';

@Injectable()
export class CanActivateCafetUser  implements CanActivate {

  constructor(private cafet: CafetService, private router: Router) { }

  canActivate(): boolean {
    this.router.navigateByUrl("/cafet-info");
    return false
    // return true;
  }
}
