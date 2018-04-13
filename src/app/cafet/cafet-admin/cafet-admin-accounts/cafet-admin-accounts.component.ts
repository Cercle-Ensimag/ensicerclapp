import { Component, OnInit, OnDestroy } from '@angular/core';

import { CafetService, CafetUser } from '../../cafet-service/cafet.service';
import { DicoService } from '../../../language/dico.service';

export class DayUser {
  user: CafetUser;
  transactions: DayTransaction[];
}
export class DayTransaction {
  id: string;
  value: number;
  date: number;
  resp: string;
}
@Component({
  selector: 'app-cafet-admin-accounts',
  templateUrl: './cafet-admin-accounts.component.html',
  styleUrls: ['./cafet-admin-accounts.component.css']
})
export class CafetAdminAccountsComponent implements OnInit, OnDestroy {

  users: CafetUser[];
  usersWatcher: any;

  dayTransactions: DayUser[];
  dayTransactionsWatcher: any;

  dayPreview = false;

  constructor(
    public cafet: CafetService,
    public d: DicoService
  ) { }

  ngOnInit() {
    this.usersWatcher = this.watchUsers();
    this.dayTransactionsWatcher = this.watchDayTransactions();
  }

  ngOnDestroy() {
    this.usersWatcher.unsubscribe();
    this.dayTransactionsWatcher.unsubscribe();
  }

  watchUsers() {
    return this.cafet.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  watchDayTransactions() {
    return this.cafet.getDayTransactions().subscribe(users => {
      this.dayTransactions = [];
      if (users) {
        Object.getOwnPropertyNames(users).forEach((emailId) => {
          let transactions = [];
          Object.getOwnPropertyNames(users[emailId]).forEach(transId => {
            transactions.push({
              id: transId,
              value: users[emailId][transId].value,
              date: users[emailId][transId].date,
              resp: users[emailId][transId].resp
            });
          });
          this.dayTransactions.push({
            user: {
              emailId: emailId,
              activated: null,
              credit: null,
              creationDate: null,
              lastTransactionDate: null,
              profile: null
            },
            transactions: transactions
          })
        });
      } else {
        this.dayPreview = false;
      }
    });
  }

  validateDayTransactions() {
    this.cafet.validateDayTransactions();
  }

  deleteDayTransaction(emailId: string, transId: string) {
    this.cafet.deleteDayTransaction(emailId, transId);
  }

}
