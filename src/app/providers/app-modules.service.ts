import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from '../../../node_modules/rxjs';
import 'rxjs/add/operator/shareReplay';

export class AppModule {
  name: string;
  displayName: string;
  disabled: boolean;
}

@Injectable()
export class AppModulesService {
  private _appModules: Observable<AppModule[]>;

  constructor(
    private db: AngularFireDatabase
  ) { }

  getAppModules(): Observable<AppModule[]> {
    if (!this._appModules){
      this._appModules = Observable.merge(
        this.db
        .list<AppModule>('admin/public/modules', ref => ref.orderByChild('order'))
        .valueChanges()
        .do(modules => localStorage.setItem('appModules', JSON.stringify(modules))),
        localStorage.getItem('appModules') ?
          Observable.of(JSON.parse(localStorage.getItem('appModules'))) :
          Observable.empty())
        .shareReplay(1);
    }
    return this._appModules;
  }
}
