import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { ToolsService } from '../../providers/tools.service';
import { Journalist, Group } from '../actu-admin/actu-admin.component';

export class Actu {
  id: string;
  title: string;
  description: string;
  image: string;
  pdfLink: string;
  date: string;
  author: string;
  groupId: string;
}

@Injectable()
export class ActusService {

  actus: Actu[];
  actusWatcher: any;

  constructor(
    private db: AngularFireDatabase,
    private tools: ToolsService
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
        this.actus = actus.reverse() || [];
      },
      err => {}
    );
  }

  getActu(actuId: string) {
    return this.db.object<Actu>('actus/actus/'+actuId).valueChanges();
  }

  getActuId() {
    return this.db.list<Actu>('actus/actus/').push(null).key;
  }

  setActu(actu: Actu) {
    return this.db.object<Actu>('actus/actus/'+actu.id).set(actu);
  }

  deleteActu(actuId: string) {
    return this.db.object<Actu>('actus/actus/'+actuId).set(null);
  }

  getJournalists() {
    return this.db.list<Journalist>('actus/journalists/users').valueChanges();
  }

  removeJournalist(emailId: string) {
    return this.db.object<Journalist>('actus/journalists/users/'+emailId).remove();
  }

  addJournalist(email: string, group: Group) {
    let emailId = this.tools.getEmailIdFromEmail(email);
    return this.db.object<Group>('actus/journalists/groups/'+group.groupId).set(group)
    .then(() => {
      return this.db.object<Journalist>('actus/journalists/users/'+emailId).set({
        emailId: emailId,
        groupId: group.groupId
      });
    });
  }

  // helpers

  getTaglessDesciption(actu: Actu) : string {
    return actu.description.replace(/<[^>]*>/g, '')
  }

}
