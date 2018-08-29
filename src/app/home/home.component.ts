import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';

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

  constructor(
    private auth: AuthService,
    private modules: AppModulesService,
    private media: DeviceSizeService,
    private location: Location,
    private d: DicoService
  ) { }

  ngOnInit() {
    this.media.start();
    this.auth.start();
  }

  ngOnDestroy() {
    this.media.stop();
    this.auth.stop();
  }

}
