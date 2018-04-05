import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { CafetService, CafetUser } from '../../cafet-service/cafet.service';
import { ToolsService } from '../../../providers/tools.service';
import { DeviceSizeService } from '../../../providers/device-size.service';
import { DicoService } from '../../../language/dico.service';

import { CafetHistoryComponent } from '../../cafet-history/cafet-history.component';
import { EditCafetUserComponent } from '../../edit-cafet-user/edit-cafet-user.component';


@Component({
  selector: 'app-cafet-admin-users',
  templateUrl: './cafet-admin-users.component.html',
  styleUrls: ['./cafet-admin-users.component.css']
})
export class CafetAdminUsersComponent implements OnInit {

  users: CafetUser[];
  displayedUsers: CafetUser[] = [];
  usersWatcher: any;

  searchCtrl: FormGroup;
  searchWatcher1: any;
  searchWatcher2: any;

  controls: {[emailId: string]: {
    add: FormControl,
    sub: FormControl
  }};

  expanded: {[emailId: string]: boolean};
  pageIndex: number = 0;
  pageSize: number = 20;
  error: string;

  constructor(
    public cafet: CafetService,
    public tools: ToolsService,
    public media: DeviceSizeService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public d: DicoService
  ) { }

  ngOnInit() {
    this.createSearchForm();
    this.usersWatcher = this.watchUsers();
  }

  ngOnDestroy() {
    this.usersWatcher.unsubscribe();
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
    this.cafet.newTransaction(user, value).then(
      () => {
        this.error = this.d.format(this.d.l.informAboutTransaction, name, value.toFixed(2));
      },
      (err) => {
        this.error = err;
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
    let dialogRef = this.dialog.open(EditCafetUserComponent, {
      data: user,
      width: '450px'
    });
  }

}
