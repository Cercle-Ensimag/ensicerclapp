import { Component, OnInit, OnDestroy } from '@angular/core';

import { DeviceSizeService } from '../providers/device-size.service';

import { AuthService } from '../auth/auth-service/auth.service';
import { AppModulesService } from '../providers/app-modules.service';

import { DicoService } from '../language/dico.service';

@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  logOutLabel: string;
  adminLabel: string;
  adminVoteLabel: string;
  adminCafetLabel: string;

  sideNav: boolean;

  constructor(
    public auth: AuthService,
    public modules: AppModulesService,
    public media: DeviceSizeService,
    public d: DicoService
  ) {
    this.sideNav = false;
  }

  ngOnInit() {
    this.media.start();
    this.auth.start();
  }

  ngOnDestroy(): void {
    this.media.stop();
    this.auth.stop();
  }

}
