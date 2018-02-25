import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

export class AppModule {
  name: string;
  displayName: string;
  disabled: boolean;
}

@Injectable()
export class AppModulesService {

  appModules: AppModule[];

  modulesWatcher: any;

  constructor(
    private db: AngularFireDatabase
  ) { }

  watchModules() {
    return this.db.list<AppModule>('admin/public/modules').valueChanges()
    .subscribe(
      modules => {
        this.appModules = modules;
      },
      err => {}
    );
  }

  start() {
    if (this.modulesWatcher) {
      this.stop();
    }
    this.modulesWatcher = this.watchModules();
  }

  stop() {
    if (this.modulesWatcher) {
      this.modulesWatcher.unsubscribe();
      this.modulesWatcher = null;
    }
  }

  getAppModules(): AppModule[] {
    return this.appModules;
  }
}
