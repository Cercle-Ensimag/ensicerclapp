import {shareReplay} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Observable} from 'rxjs';
import {ToolsService} from './tools.service';


export class AppModule {
  name: string;
  displayName: string;
  disabled: boolean;
}

@Injectable()
export class AppModulesService {
  private _appModules: Observable<AppModule[]>;

  constructor(
    private db: AngularFireDatabase,
    private tools: ToolsService
  ) {
  }

  getAppModules(): Observable<AppModule[]> {
    if (!this._appModules) {
      this._appModules = this.tools.enableCache(
        this.db
          .list<AppModule>('admin/public/modules', ref => ref.orderByChild('order'))
          .valueChanges(),
        '_appModules')
        .pipe(shareReplay(1));
    }
    return this._appModules;
  }
}
