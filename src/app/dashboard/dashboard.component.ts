import { Component, OnInit } from '@angular/core';

import { AppModulesService, AppModule } from '../providers/app-modules.service';
import { DeviceSizeService } from '../providers/device-size.service';
import { ListService } from '../providers/list.service';
import { EventsService, Event } from '../events/events-service/events.service';
import { VoteService } from '../vote/vote-service/vote.service';
import { Observable, pipe, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	private _active: boolean = false;
	private _isPolls: boolean = false;
	private _hasChanged: boolean = false;
	private _modulesObs: Observable<AppModule[]>;
	private _contentObs: { [modName: string]: Observable<string[]> } = {};

  constructor(
    public modules: AppModulesService,
    public media: DeviceSizeService,
		public list: ListService,
		private events: EventsService,
		private votes: VoteService
  ) {}

  ngOnInit() {
		this.list.isLoggedUserInList().subscribe(active => {
			let oldActive = this._active;
			this._active = active;
			this._hasChanged = this._active != oldActive;
		});
		this.votes.getPolls().subscribe(votes => {
			let isPolls = this._isPolls;
			this._isPolls = votes.length > 0;
			this._hasChanged = this._isPolls != isPolls;
		});
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
		if (!this._modulesObs || this._hasChanged) {
			this._hasChanged = false;
			this._modulesObs = this.modules.getAppModules().pipe(
				map(modules => modules.filter(
					mod => {
						if (mod.name === "votes" && !this._isPolls) {
							return false;
						}
						return !mod.disabled && !(mod.restricted && !this._active)
					}
				)),
				map(modules => modules) // TODO: sort actus, jobads, nsigma by last publication ?
			);
		}
		return this._modulesObs;
	}

}
