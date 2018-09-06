import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {ToolsService} from '../../providers/tools.service';
import {Observable} from '../../../../node_modules/rxjs';
import {User} from 'firebase/app';

@Injectable()
export class AdminService {
  private _users: Observable<User[]>;

  constructor(
    private db: AngularFireDatabase,
    private tools: ToolsService
  ) { }

  getUsers() {
    if (!this._users){
      this._users = this.db
        .list<User>('users')
        .valueChanges()
        .map((users: User[]) => users.filter((user: User) => !!user[user.uid]))
        .shareReplay(1);
    }
    return this._users;
  }

  setUserAdminOf(email: string, uid: string, of: string, checked: boolean) {
    return this.db
      .object('users/'+this.tools.getEmailIdFromEmail(email)+'/'+uid+'/admin/'+ of +'-admin')
      .set(checked);
  }
}
