import {shareReplay} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Observable, of} from 'rxjs';
import {ToolsService} from './tools.service';
import {DicoService} from '../language/dico.service';


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

  constructor(
    private db: AngularFireDatabase,
    private tools: ToolsService,
		private d: DicoService
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
  }

  getAppModules(): Observable<AppModule[]> {
		return of(this.modules);
  }
}
