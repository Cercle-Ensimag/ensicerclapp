import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {ToolsService} from './tools.service';
import {DicoService} from '../language/dico.service';
import {ListService} from '../providers/list.service';
import {EventsService, Event} from '../events/events-service/events.service';
import {VoteService} from '../vote/vote-service/vote.service';
import {Observable, pipe, of} from 'rxjs';
import {map,shareReplay} from 'rxjs/operators';

const index = {
	"events": -3,
	"calendar": -2,
	"actus": 2,
	"jobads": 2,
	"nsigma": 2,
	"votes": 4,
	"cafet": 5,
	"infos": 6
};

export class AppModule {
  name: string;
  displayName: string;
	fullName: string;
	description: string;
  disabled: boolean;
	restricted: boolean;
	content: boolean;
	order: number;

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
		for (let mod of Object.getOwnPropertyNames(index)) {
			this.modules.push(
				new AppModule(
					mod,
					this.d.l[mod + 'ModuleDisplayName'],
					this.d.l[mod + 'ModuleFullName'],
					this.d.l[mod + 'ModuleDescription'],
					false,
					["votes"].includes(mod) ? true : false,
					["events"].includes(mod) ? true : false,
				)
			);
		}
		this.list.isLoggedUserInList().subscribe(active => {
			let oldActive = this._active;
			this._active = active;
			this._hasChanged = this._active != oldActive;
		});
		this.votes.getPollsIDidntAnswer().subscribe(polls => {
			let isPolls = this._isPolls;
			this._isPolls = polls.length > 0;
			this._hasChanged = this._isPolls != isPolls;
		});
  }

	getAppModules(): Observable<AppModule[]> {
		if (!this._modulesObs || this._hasChanged) {
			this._hasChanged = false;
			this._modulesObs = of(this.modules).pipe(
				map(modules => modules.filter(
					mod => {
						return !mod.disabled && !(mod.restricted && !this._active);
					}
				)),
				map(modules => modules.map(mod => {
					mod.order = index[mod.name];

					if (mod.name === "votes" && this._isPolls) {
						mod.order = -mod.order;
					}
					return mod;
				})),
				map(modules => modules.sort(
					(mod1, mod2) => mod1.order - mod2.order
				)),
				shareReplay(1)
			);
		}
		return this._modulesObs;
	}
}
