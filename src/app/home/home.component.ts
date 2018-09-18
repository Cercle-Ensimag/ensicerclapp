import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';

import {DeviceSizeService} from '../providers/device-size.service';

import {AuthService} from '../auth/auth-service/auth.service';
import {AppModulesService} from '../providers/app-modules.service';
import {DicoService} from '../language/dico.service';

import {MatSidenav} from '@angular/material';

import {first} from 'rxjs/operators';

@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})

export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav) snav: MatSidenav;

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

  openSnav() {
    this.auth.isLoggedAndHasEmailVerified().pipe(
      first()
    ).subscribe(is => { if (is) this.snav.open()});
  }

}
