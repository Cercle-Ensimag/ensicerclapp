import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../../auth/auth-service/auth.service';

@Injectable()
export class AdminService {

  users: any;

  usersWatcher: any;

  constructor(
    private db: AngularFireDatabase,
    private auth: AuthService
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
    return this.db.list<any>('users').valueChanges()
    .subscribe(users => {
      this.users = users.filter(user => user[user.uid]);
    })
  }

  setVoteAdmin(email: string, uid: string, checked: boolean) {
    this.db.object('users/'+this.auth.getEmailIdFromEmail(email)+'/'+uid+'/admin/vote-admin').set(checked);
  }

  setEventsAdmin(email: string, uid: string, checked: boolean) {
    this.db.object('users/'+this.auth.getEmailIdFromEmail(email)+'/'+uid+'/admin/events-admin').set(checked);
  }

  setActusAdmin(email: string, uid: string, checked: boolean) {
    this.db.object('users/'+this.auth.getEmailIdFromEmail(email)+'/'+uid+'/admin/actus-admin').set(checked);
  }

  setCafetAdmin(email: string, uid: string, checked: boolean) {
    this.db.object('users/'+this.auth.getEmailIdFromEmail(email)+'/'+uid+'/admin/cafet-admin').set(checked);
  }

}
