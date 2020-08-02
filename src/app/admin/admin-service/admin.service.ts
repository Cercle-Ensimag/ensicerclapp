import { map, shareReplay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Tools } from '../../providers/tools.service';
import { Observable } from 'rxjs';
import { User } from 'firebase';

@Injectable()
export class AdminService {
	private _users: Observable<User[]>;

	constructor(
		private db: AngularFireDatabase
	) { }

	getUsers() {
		if (!this._users) {
			this._users = this.db.list<User>('users').valueChanges().pipe(
				map((users: User[]) => users.filter((user: User) => !!user[user.uid])),
				shareReplay(1)
			);
		}
		return this._users;
	}

	setUserAdminOf(email: string, uid: string, of: string, checked: boolean) {
		return this.db.object(
			'users/' + Tools.getEmailIdFromEmail(email) + '/' + uid + '/admin/' + of + '-admin'
		).set(checked);
	}
}
