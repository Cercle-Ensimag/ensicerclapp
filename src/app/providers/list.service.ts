import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';

import { ToolsService } from './tools.service';

@Injectable()
export class ListService {


  authUsers: any;
  authUsersWatcher: any;

  constructor(
    private db: AngularFireDatabase,
    private tools: ToolsService
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

  isInList(email: string) {
    return this.authUsers[this.tools.getEmailIdFromEmail(email)] === email.toLowerCase();
  }

}
