import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

import {ToolsService} from '../../providers/tools.service';
import {Group, Journalist} from '../actu-admin/actu-admin.component';

import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';

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
  private _actus: Observable<Actu[]>;
  private _journalists: Observable<Journalist[]>;
  private _actu: { [$actuId: string]: Observable<Actu> } = {};

  constructor(
    private db: AngularFireDatabase,
    private tools: ToolsService
  ) { }

  getActus() {
    if (!this._actus){
      this._actus = this.tools.enableCache(
        this.db
          .list<Actu>('actus/actus')
          .valueChanges().pipe(
          map(annonces => annonces.reverse())), '_actus')
        .pipe(shareReplay(1));
    }
    return this._actus;
  }

  getActu(actuId: string) {
    if (!this._actu[actuId]){
      this._actu[actuId] = this.tools.enableCache(
        this.db
          .object<Actu>('actus/actus/'+actuId)
          .valueChanges(), `_actu_${actuId}`)
        .pipe(shareReplay(1));
    }
    return this._actu[actuId];
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
    if (!this._journalists){
      this._journalists = this.db
        .list<Journalist>('actus/journalists/users')
        .valueChanges().pipe(
        map(annonces => annonces.reverse()))
        .pipe(shareReplay(1));
    }
    return this._journalists;
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

  addJournalistEmailId(emailId: string, group: Group) {
    return this.db.object<Group>('actus/journalists/groups/'+group.groupId).set(group)
      .then(() => {
        return this.db.object<Journalist>('actus/journalists/users/'+emailId).set({
          emailId: emailId,
          groupId: group.groupId
        });
      });
  }
}
