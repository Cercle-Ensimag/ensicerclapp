import { Component, OnInit } from '@angular/core';

import { AppModulesService, AppModule } from '../providers/app-modules.service';
import { DeviceSizeService } from '../providers/device-size.service';
import { EventsService } from '../events/events-service/events.service';
import { Observable, pipe, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	private _contentObs: { [modName: string]: Observable<string[]> } = {};

  constructor(
		private events: EventsService,
    public modules: AppModulesService,
    public media: DeviceSizeService
  ) {}

  ngOnInit() {
	}

	getContent(modName: string): Observable<string[]>{
		if (!this._contentObs[modName]) {
			if (modName === "events") {
				this._contentObs[modName] = this.getEvents();
			}
			else {
				this._contentObs[modName] = of([]);
			}
		}
		return this._contentObs[modName];
	}

	getEvents() {
		return this.events.getActiveEvents().pipe(
			map(events => events.map(event => event.title)),
			// TODO: random sort among events of the week ?
		);
	}

	getModules(): Observable<AppModule[]> {
		return this.modules.getAppModules();
	}

}
