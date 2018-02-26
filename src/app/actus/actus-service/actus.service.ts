import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { AuthService } from '../../auth/auth-service/auth.service';
import { Actu } from '../actus-home/actus-home.component';
import { ComResp, Group } from '../actu-admin/actu-admin.component';

@Injectable()
export class ActusService {

  actus: Actu[] = [];
  actusWatcher: any;

  constructor(
    private db: AngularFireDatabase,
    private auth: AuthService
  ) { }

  start() {
    if (this.actusWatcher) {
      this.stop();
    }
    this.actusWatcher = this.watchActus();
  }

  stop() {
    if (this.actusWatcher) {
      this.actusWatcher.unsubscribe();
      this.actusWatcher = null;
    }
  }

  watchActus() {
    return this.db.list<Actu>('actus/actus').valueChanges().subscribe(
      actus => {
        this.actus = actus || [];
      },
      err => {}
    );
  }

  getActu(actuId: string) {
    return this.db.object<Actu>('actus/actus/'+actuId).valueChanges();
  }

  setActu(actu: Actu) {
    return this.db.object<Actu>('actus/actus/'+actu.id).set(actu);
  }

  deleteActu(actuId: string) {
    return this.db.object<Actu>('actus/actus/'+actuId).set(null);
  }

  getJournalists() {
    return this.db.list<ComResp>('actus/journalists/users').valueChanges();
  }

  removeJournalist(emailId: string) {
    return this.db.object<ComResp>('actus/journalists/users/'+emailId).remove();
  }

  addJournalist(email: string, group: Group) {
    let emailId = this.auth.getEmailIdFromEmail(email);
    return this.db.object<Group>('actus/journalists/groups/'+group.groupId).set(group)
    .then(() => {
      return this.db.object<ComResp>('actus/journalists/users/'+emailId).set({
        emailId: emailId,
        groupId: group.groupId
      });
    });
  }


}
