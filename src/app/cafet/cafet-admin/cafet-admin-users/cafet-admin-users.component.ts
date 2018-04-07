import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { CafetService, CafetUser } from '../../cafet-service/cafet.service';
import { ToolsService } from '../../../providers/tools.service';
import { DeviceSizeService } from '../../../providers/device-size.service';
import { DicoService } from '../../../language/dico.service';
import { ListService } from '../../../providers/list.service';

import { CafetHistoryComponent } from '../../cafet-history/cafet-history.component';
import { EditCafetUserComponent } from '../edit-cafet-user/edit-cafet-user.component';


@Component({
  selector: 'app-cafet-admin-users',
  templateUrl: './cafet-admin-users.component.html',
  styleUrls: ['./cafet-admin-users.component.css']
})
export class CafetAdminUsersComponent implements OnInit {

  users: CafetUser[];
  displayedUsers: CafetUser[] = [];
  matchUsers: CafetUser[] = [];
  usersWatcher: any;

  searchCtrl: FormGroup;
  searchWatcher1: any;
  searchWatcher2: any;

  accountCtrl: FormGroup;
  accountWatcher1: any;
  accountWatcher2: any;

  controls: {[emailId: string]: {
    add: FormControl,
    sub: FormControl
  }};

  expanded: {[emailId: string]: boolean};
  pageIndex: number = 0;
  pageSize: number = 10;
  error: string;
  exte: boolean;
  edit: boolean;

  constructor(
    public cafet: CafetService,
    public tools: ToolsService,
    private list: ListService,
    public media: DeviceSizeService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public d: DicoService
  ) { }

  ngOnInit() {
    this.createAccountForm();
    this.usersWatcher = this.watchUsers();
    this.list.start();
  }

  ngOnDestroy() {
    this.usersWatcher.unsubscribe();
    this.list.stop();
  }

  watchUsers() {
    return this.cafet.getUsers().subscribe(users => {
      this.users = users;
      this.controls = {};
      this.expanded = {};
      for (let user of users) {
        this.controls[user.emailId] = {
          add: new FormControl("", [Validators.required, Validators.max(1000), Validators.min(0.1)]),
          sub: new FormControl("", [Validators.required, Validators.max(1000), Validators.min(0.1)])
        };
        this.expanded[user.emailId] = false;
      }
      this.sortUsers(this.getAccountEmail());
      this.findMatchUsers(this.getAccountEmail());
    });
  }


  // Accounts

  tryCreateCafetAccount() {
    let emailId = this.tools.getEmailIdFromEmail(this.getAccountEmail());
    let name = this.tools.titleCase(emailId.replace('|', ' ').replace('  ', ' '));

    if (this.list.authUsers[emailId] !== this.getAccountEmail().toLowerCase()) {
      this.error = this.d.format(this.d.l.notOnTheList, name);
      this.exte = true;
    } else {
      this.createCafetAccount(false);
    }
  }

  createCafetAccount(exte: boolean) {
    let user = {
      credit: 0,
      activated: true,
      emailId: (exte ? "%exte%": "") +  this.tools.getEmailIdFromEmail(this.getAccountEmail()),
      creationDate: (new Date()).getTime(),
      lastTransactionDate: (new Date()).getTime(),
      profile: {
        firstName: this.tools.titleCase(this.getAccountFirstname()),
        lastName: this.tools.titleCase(this.getAccountLastName()),
        email: this.getAccountEmail(),
        exte: exte
      }
    };
    this.cafet.setUserAccount(user).then(
      () => {
        this.cafet.newTransaction(user, this.getAccountCredit()).then(
          () => {
            let value = this.getAccountCredit();
            this.clearAccountCreation()
            this.error = this.d.format(this.d.l.informAboutCafetCreation, this.cafet.getUserName(user), value.toFixed(2));
          },
          (err) => {
            this.error = err;
          }
        );
      },
      (err) => {
        this.error = err;
      }
    );
  }

  clearAccountCreation() {
    this.accountCtrl.reset({
      firstName: '',
      lastName: '',
      email: '',
      credit: 0
    });
    this.exte = false;
  }

  createAccountForm() {
    this.accountCtrl = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.email]],
      credit: [0, []]
    });
    if (this.accountWatcher1) {
      this.accountWatcher1.unsubscribe();
    }
    this.accountWatcher1 = this.accountCtrl.get('email').valueChanges.subscribe((email) => {
      this.findMatchUsers(email);
      this.sortUsers(email);
    });
    if (this.accountWatcher2) {
      this.accountWatcher2.unsubscribe();
    }
    this.accountWatcher2 = this.accountCtrl.valueChanges.subscribe(() => {
      this.error = null;
    });
  }

  getAccountFirstname() {
    return this.accountCtrl.get('firstName').value;
  }

  getAccountLastName() {
    return this.accountCtrl.get('lastName').value;
  }

  getAccountEmail() {
    return this.accountCtrl.get('email').value;
  }

  getAccountCredit() {
    return this.accountCtrl.get('credit').value;
  }

  findMatchUsers(email: string) {
    let emailId = this.tools.getEmailIdFromEmail(email);
    this.matchUsers = this.users.filter(
      user => user.emailId.includes(emailId)
    );
  }


  // transactions

  transaction(user: CafetUser, add: boolean) {
    let value;
    if (add){
      value = this.controls[user.emailId].add.value;
    } else {
      value = -this.controls[user.emailId].sub.value;
    }
    let name = this.tools.titleCase(user.emailId.replace('|', ' ').replace('  ', ' '));
    this.controls[user.emailId].add.setValue("");
    this.controls[user.emailId].sub.setValue("");
    this.cafet.newTransaction(user, value).then(
      () => {
        this.error = this.d.format(this.d.l.informAboutTransaction, name, value.toFixed(2));
      },
      (err) => {
        this.error = err;
      }
    );
  }

  sortUsers(email: string) {
    let emailId = this.tools.getEmailIdFromEmail(email);
    this.pageIndex = 0;
    this.displayedUsers = this.users.filter(
      user => user.emailId.includes(emailId)
    );
  }

  updateList(event) {
    this.pageIndex = event.pageIndex;
  }

  openHistory(user: CafetUser): void {
    let dialogRef = this.dialog.open(CafetHistoryComponent, {
      data: user,
      width: '450px'
    });
  }

  openEditor(user: CafetUser): void {
    let dialogRef = this.dialog.open(EditCafetUserComponent, {
      data: user,
      width: '450px'
    });
  }

}
