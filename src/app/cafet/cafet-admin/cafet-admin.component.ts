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

  searchCtrl: FormGroup;
  searchWatcher: any;

  controls: {[emailId: string]: {
    add: FormControl,
    sub: FormControl
  }};
  expanded: {[emailId: string]: boolean};

  usersWatcher: any;

  pageIndex: number = 0;
  pageSize: number = 20;

  error: string;

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
          add: new FormControl("", [Validators.required]),
          sub: new FormControl("", [Validators.required])
        };
        this.expanded[user.emailId] = false;
      }
      this.sortUsers(this.getSearchEmail());
    })
  }

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

  createCafetAccount() {
    let emailId = this.tools.getEmailIdFromEmail(this.getSearchEmail());
    let name = this.tools.titleCase(emailId.replace('|', ' ').replace('  ', ' '));
    if (this.list.authUsers[emailId] !== this.getSearchEmail()) {
      this.error = this.d.format(this.d.l.notOnTheList, name);
    } else {
      let user = {
        credit: 0,
        activated: true,
        emailId: emailId,
        creationDate: (new Date()).getTime()
      };
      this.cafet.setUserAccount(user).then(
        () => {
          this.cafet.newTransaction(user, this.getSearchCredit()).then(
            () => {
              let value = this.getSearchCredit();
              this.searchCtrl.get('email').setValue("");
              this.searchCtrl.get('credit').setValue(0);
              this.error = this.d.format(this.d.l.informAboutCafetCreation, name, value.toFixed(2));
            },
            (err) => {
              this.error = err.toSring();
            }
          );
        },
        (err) => {
          this.error = err.toSring();
        }
      );
    }
  }

  createSearchForm() {
    this.searchCtrl = this.fb.group({
      email: ['', [Validators.email]],
      credit: [0, []]
    });
    if (this.searchWatcher) {
      this.searchWatcher.unsubscribe();
    }
    this.searchWatcher = this.searchCtrl.get('email').valueChanges.subscribe((email) => {
      this.sortUsers(email);
    });
    this.searchWatcher = this.searchCtrl.valueChanges.subscribe(() => {
      this.error = null;
    });
  }

  getSearchEmail() {
    return this.searchCtrl.get('email').value;
  }

  getSearchCredit() {
    return this.searchCtrl.get('credit').value;
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

}
