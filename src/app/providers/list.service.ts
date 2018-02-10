import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class ListService {


  authUsers: any;
  authUsersWatcher: any;

  constructor(
    private db: AngularFireDatabase
  ) { }

  start() {
    this.authUsersWatcher = this.watchAuthUsers();
  }

  stop () {
    this.authUsersWatcher.unsubscribe();
  }

  watchAuthUsers() {
    return this.db.object('list/users').valueChanges().subscribe(users => {
      this.authUsers = users;
    });
  }

}
