import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../auth/auth-service/auth.service';

export class CafetUser {
  activated: boolean;
  credit: number;
  emailId: string;
}

export class Transaction {
  value: number;
  oldCredit: number;
  newCredit: number;
}

export class Ingredient {
  name: string;
  group: string;
  alias: string;
  image: string;
}

@Injectable()
export class CafetService {

  user: CafetUser;

  userWatcher: any;

  constructor(
    private db: AngularFireDatabase,
    private auth: AuthService
  ) { }

  start() {
    this.userWatcher = this.watchUser();
  }

  stop() {
    this.userWatcher.unsubscribe();
  }

  watchUser() {
    return this.db.object<CafetUser>("cafet/users/"+this.auth.getEmailId())
    .valueChanges().subscribe(user => {
      this.user = user || new CafetUser();
    })
  }

  getUser(emailId): Observable<CafetUser> {
    return this.db.object<CafetUser>("cafet/users/"+emailId).valueChanges();
  }

  getUsers(): Observable<CafetUser[]> {
    return this.db.list<CafetUser>("cafet/users").valueChanges();
  }

  setUserAccount(user: CafetUser) {
    return this.db.object<CafetUser>("cafet/users/"+user.emailId).set(user);
  }

  sendAccountRequest() {
    return this.db.object<string>("cafet/users/"+this.auth.getEmailId()+"/emailId")
    .set(this.auth.getEmailId());
  }

  newTransaction(user: CafetUser, value: number) {
    let oldCredit = user.credit;
    let newCredit = oldCredit + value;
    return this.db.object<number>("cafet/users/"+user.emailId+"/credit").set(newCredit)
    .then(() => {
      return this.db.list<Transaction>("cafet/history/"+user.emailId).push({
        value: value,
        oldCredit: oldCredit,
        newCredit: newCredit
      });
    });
  }

}
