import { Component, OnInit } from '@angular/core';

import { AppModulesService } from '../providers/app-modules.service';
import { DeviceSizeService } from '../providers/device-size.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    public modules: AppModulesService,
    public media: DeviceSizeService
  ) { }

  ngOnInit() {
  }

}
