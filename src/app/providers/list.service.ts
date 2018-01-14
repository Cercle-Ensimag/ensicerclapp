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

  format(email: string): string {
    return email.split('@')[0].replace('.', '|')
    .toLowerCase().replace('-', '|')
    .replace('1', '').replace('2', '').replace('3', '');
  }

}
