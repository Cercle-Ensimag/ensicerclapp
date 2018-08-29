import { Injectable } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from '../../../../node_modules/rxjs/Observable';
import {CafetUser} from '../../cafet/cafet-service/cafet.service';
import {User} from 'firebase/app';

@Injectable()
export class UsersService {

  constructor(
    private db: AngularFireDatabase
  ) { }

  getUsers() {
    return this.db.list<User>('users').valueChanges();
  }

  getUser(emailId: string): Observable<User> {
    return this.db.object<User>("/users/"+emailId).valueChanges();
  }

  exists(emailId: string): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.getUser(emailId).subscribe(
        user => resolve(true),
        err => resolve(false)
      )
    })
  }
}
