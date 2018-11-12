import {map, mergeMap, shareReplay} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {User} from 'firebase/app';

import {AuthService} from '../auth/auth-service/auth.service';
import {ToolsService} from './tools.service';
import {Observable} from 'rxjs';

@Injectable()
export class ListService {
  private _email: { [$emailId: string]: Observable<string> } = {};
  private _inList: { [$emailId: string]: Observable<boolean> } = {};
	private _isActive: Observable<boolean>;

  constructor(
    private db: AngularFireDatabase,
    private tools: ToolsService,
		private auth: AuthService
  ) {
  }

  getEmail(emailId: string): Observable<string> {
    if (!this._email[emailId]) {
      this._email[emailId] = this.db
        .object<any>('list/users/' + emailId)
        .valueChanges()
        .pipe(shareReplay(1));
    }
    return this._email[emailId];
  }

  isInList(email: string): Observable<boolean> {
    const emailId = this.tools.getEmailIdFromEmail(email);

    if (!this._inList[emailId]) {
      this._inList[emailId] = this.getEmail(emailId).pipe(
        map(emailRetrieved => emailRetrieved === email.toLowerCase()),
        shareReplay(1));
    }

    return this._inList[emailId];
  }

	isLoggedUserInList(): Observable<boolean> {
		if (!this._isActive) {
			this._isActive = this.tools.enableCache(
				this.auth.getLoggedUser().pipe(
					mergeMap(
						(user: User) => this.getEmail(
							this.tools.getEmailIdFromEmail(user.email)
						).pipe(map(email => email === user.email))
					)
				),
				`_iAmInList`
			).pipe(
				shareReplay(1)
			)
		}
		return this._isActive;
	}

}
