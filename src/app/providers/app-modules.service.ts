import {shareReplay, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {EMPTY, merge, Observable, of} from 'rxjs';


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
  ) {
  }

  getAppModules(): Observable<AppModule[]> {
    if (!this._appModules) {
      this._appModules = merge(
        this.db
          .list<AppModule>('admin/public/modules', ref => ref.orderByChild('order'))
          .valueChanges()
          .pipe(
            tap(modules => localStorage.setItem('appModules', JSON.stringify(modules)))),
        localStorage.getItem('appModules') ?
          of(JSON.parse(localStorage.getItem('appModules'))) :
          EMPTY)
        .pipe(shareReplay(1));
    }
    return this._appModules;
  }
}
