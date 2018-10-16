import { Component, OnInit } from '@angular/core';

import { AppModulesService, AppModule } from '../providers/app-modules.service';
import { DeviceSizeService } from '../providers/device-size.service';
import { ListService } from '../providers/list.service';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	active: boolean = false;

  constructor(
    public modules: AppModulesService,
    public media: DeviceSizeService,
		public list: ListService
  ) {}

  ngOnInit() {
		this.list.isLoggedUserInList().subscribe(active => {
			this.active = active;
		})
	}

	getModules(): Observable<AppModule[]> {
		return this.modules.getAppModules()
		.pipe(map(modules => modules.filter(mod => !mod.disabled && !(mod.restricted && !this.active))));
	}

}
