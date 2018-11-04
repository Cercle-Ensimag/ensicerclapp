import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {ToolsService} from './tools.service';
import {DicoService} from '../language/dico.service';
import {ListService} from '../providers/list.service';
import {EventsService, Event} from '../events/events-service/events.service';
import {VoteService} from '../vote/vote-service/vote.service';
import {Observable, pipe, of} from 'rxjs';
import {map,shareReplay} from 'rxjs/operators';

export class AppModule {
  name: string;
  displayName: string;
	fullName: string;
	description: string;
  disabled: boolean;
	restricted: boolean;
	content: boolean;

	constructor(
		name: string, displayName: string, fullName: string, description: string,
		disabled: boolean, restricted: boolean, content: boolean
	) {
		this.name = name;
		this.displayName = displayName;
		this.fullName = fullName;
		this.description = description;
		this.disabled = disabled;
		this.restricted = restricted;
		this.content = content;
	}
}

@Injectable()
export class AppModulesService {

	private modules: AppModule[] = [];
	private _active: boolean = false;
	private _isPolls: boolean = false;
	private _hasChanged: boolean = false;
	private _modulesObs: Observable<AppModule[]>;

  constructor(
    private db: AngularFireDatabase,
    private tools: ToolsService,
		private d: DicoService,
		private list: ListService,
		private events: EventsService,
		private votes: VoteService
  ) {
		for (let mod of ["votes", "events", "calendar", "cafet", "actus", "jobads", "nsigma", "infos"]) {
			this.modules.push(
				new AppModule(
					mod,
					this.d.l[mod + 'ModuleDisplayName'],
					this.d.l[mod + 'ModuleFullName'],
					this.d.l[mod + 'ModuleDescription'],
					false,
					["votes"].includes(mod) ? true : false,
					["events"].includes(mod) ? true : false
				)
			);
		}
		this.list.isLoggedUserInList().subscribe(active => {
			let oldActive = this._active;
			this._active = active;
			this._hasChanged = this._active != oldActive;
		});
		this.votes.getStartedPolls().subscribe(votes => {
			let isPolls = this._isPolls;
			this._isPolls = votes.length > 0;
			this._hasChanged = this._isPolls != isPolls;
		});
  }

	getAppModules(): Observable<AppModule[]> {
		if (!this._modulesObs || this._hasChanged) {
			this._hasChanged = false;
			this._modulesObs = of(this.modules).pipe(
				map(modules => modules.filter(
					mod => {
						if (mod.name === "votes" && !this._isPolls) {
							return false;
						}
						return !mod.disabled && !(mod.restricted && !this._active)
					}
				)),
				map(modules => modules), // TODO: sort actus, jobads, nsigma by last publication ?
				shareReplay(1)
			);
		}
		return this._modulesObs;
	}
}
