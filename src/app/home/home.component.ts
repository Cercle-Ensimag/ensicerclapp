import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';

import {DeviceSizeService} from '../providers/device-size.service';

import {AuthService} from '../auth/auth-service/auth.service';
import {AppModulesService} from '../providers/app-modules.service';

import {DicoService} from '../language/dico.service';

@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(
    public auth: AuthService,
    public modules: AppModulesService,
    public media: DeviceSizeService,
    public location: Location,
    public d: DicoService
  ) { }

  ngOnInit() {
    this.media.start();
  }

  ngOnDestroy() {
    this.media.stop();
  }

}
