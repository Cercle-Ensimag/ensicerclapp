import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';

import { ToolsService } from './tools.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ListService {
  private _email: { [$emailId: string]: Observable<string>} = {};
  private _inList: { [$emailId: string]: Observable<boolean>} = {};

  constructor(
    private db: AngularFireDatabase,
    private tools: ToolsService
  ) { }

  getEmail(emailId: string): Observable<string> {
    if (!this._email[emailId]){
      this._email[emailId] = this.db
        .object<any>('list/users/' + emailId)
        .valueChanges()
        .shareReplay(1);
    }
    return this._email[emailId];
  }

  isInList(email: string): Observable<boolean> {
    const emailId = this.tools.getEmailIdFromEmail(email);

    if (!this._inList[emailId]){
      this._inList[emailId] = this.getEmail(emailId)
        .map(emailRetrieved => emailRetrieved === email.toLowerCase())
        .shareReplay(1);
    }
    return this._inList[emailId];
  }

}
