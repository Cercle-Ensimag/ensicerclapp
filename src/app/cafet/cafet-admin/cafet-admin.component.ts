import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { ToolsService } from '../../providers/tools.service';
import { ListService } from '../../providers/list.service';
import { DeviceSizeService } from '../../providers/device-size.service';
import { CafetService, CafetUser } from '../cafet-service/cafet.service';
import { DicoService } from '../../language/dico.service';

import { CafetHistoryComponent } from '../cafet-history/cafet-history.component';

@Component({
  selector: 'app-cafet-admin',
  templateUrl: './cafet-admin.component.html',
  styleUrls: ['./cafet-admin.component.css']
})
export class CafetAdminComponent implements OnInit, OnDestroy {

  users: CafetUser[];
  displayedUsers: CafetUser[] = [];
  matchUsers: CafetUser[] = [];

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

  usersWatcher: any;

  pageIndex: number = 0;
  pageSize: number = 20;

  error: string;
  message: string;
  exte: boolean;

  constructor(
    public cafet: CafetService,
    public tools: ToolsService,
    public media: DeviceSizeService,
    private list: ListService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public d: DicoService
  ) { }

  ngOnInit() {
    this.createSearchForm();
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
          add: new FormControl("", [Validators.required, Validators.max(1000), Validators.min(0)]),
          sub: new FormControl("", [Validators.required, Validators.max(1000), Validators.min(0)])
        };
        this.expanded[user.emailId] = false;
      }
      this.sortUsers(this.getSearchEmail());
      this.findMatchUsers(this.getAccountEmail());
    })
  }

  // Clients

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
    this.expanded[user.emailId] = false;
    this.cafet.newTransaction(user, value).then(
      () => {
        this.error = this.d.format(this.d.l.informAboutTransaction, name, value.toFixed(2));
      },
      (err) => {
        this.error = err.toSring();
      }
    );
  }

  createSearchForm() {
    this.searchCtrl = this.fb.group({
      email: ['', [Validators.email]]
    });
    if (this.searchWatcher1) {
      this.searchWatcher1.unsubscribe();
    }
    this.searchWatcher1 = this.searchCtrl.get('email').valueChanges.subscribe((email) => {
      this.sortUsers(email);
    });
    if (this.searchWatcher2) {
      this.searchWatcher2.unsubscribe();
    }
    this.searchWatcher1 = this.searchCtrl.valueChanges.subscribe(() => {
      this.error = null;
    });
  }

  getSearchEmail() {
    return this.searchCtrl.get('email').value;
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
    // TODO
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
            this.error = this.d.format(this.d.l.informAboutCafetCreation, this.getUserName(user), value.toFixed(2));
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

  getUserName(user: CafetUser) {
    if (!user.profile) {
      return this.tools.titleCase(user.emailId.split('|').join(' '))
    } else {
      return this.tools.titleCase(user.profile.firstName + " " + user.profile.lastName);
    }
  }

}
