import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../auth/auth-service/auth.service';
import { ToolsService } from '../../providers/tools.service';

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
  ofTheWeek: boolean;
}

@Injectable()
export class CafetService {

  user: CafetUser;
  ingrGroups: string[];

  userWatcher: any;
  ingrGroupsWatcher: any;

  constructor(
    private db: AngularFireDatabase,
    private tools: ToolsService,
    private auth: AuthService
  ) { }

  start() {
    this.userWatcher = this.watchUser();
    this.ingrGroupsWatcher = this.watchIngrGroups();
  }

  stop() {
    this.userWatcher.unsubscribe();
    this.ingrGroupsWatcher = this.watchIngrGroups();
  }

  watchUser() {
    return this.db.object<CafetUser>("cafet/users/"+this.auth.getEmailId())
    .valueChanges().subscribe(user => {
      this.user = user || new CafetUser();
    })
  }

  getIngredients(): Observable<Ingredient[]> {
    return this.db.list<Ingredient>("cafet/public/ingredients/individual").valueChanges();
  }

  setIngredient(ingredient: Ingredient, key: string) {
    if (key === null) {
      return this.db.list<Ingredient>("cafet/public/ingredients/individual")
      .push(ingredient);
    } else {
      return this.db.list<Ingredient>("cafet/public/ingredients/individual")
      .update(key, ingredient);
    }
  }

  watchIngrGroups() {
    return this.db.list<string>("cafet/public/ingredients/groups").valueChanges()
    .subscribe(groups => {
      this.ingrGroups = groups;
    });
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
    let newCredit = this.tools.round(oldCredit + value, 2);
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
