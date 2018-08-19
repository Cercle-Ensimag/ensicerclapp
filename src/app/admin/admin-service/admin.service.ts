import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { ToolsService } from '../../providers/tools.service';
import {Subscription} from '../../../../node_modules/rxjs';

@Injectable()
export class AdminService {

  users: any;

  public usersWatcher: Subscription;

  constructor(
    private db: AngularFireDatabase,
    private tools: ToolsService
  ) { }

  start() {
    if (this.usersWatcher) {
      this.stop();
    }
    this.usersWatcher = this.watchUsers();
  }

  stop() {
    if (this.usersWatcher) {
      this.usersWatcher.unsubscribe();
      this.usersWatcher = null;
    }
  }

  watchUsers() {
    return this.getUsers().subscribe(users => {
      this.users = users.filter(user => user[user.uid]);
    })
  }

  getUsers() {
    return this.db.list<any>('users').valueChanges();
  }

  setUserAdminOf(email: string, uid: string, of: string, checked: boolean) {
    this.db.object('users/'+this.tools.getEmailIdFromEmail(email)+'/'+uid+'/admin/'+ of +'-admin').set(checked);
  }

}
