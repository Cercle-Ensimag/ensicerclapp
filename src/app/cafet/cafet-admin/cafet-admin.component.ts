import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { ToolsService } from '../../providers/tools.service';
import { DeviceSizeService } from '../../providers/device-size.service';
import { CafetService, CafetUser } from '../cafet-service/cafet.service';
import { DicoService } from '../../language/dico.service';

@Component({
  selector: 'app-cafet-admin',
  templateUrl: './cafet-admin.component.html',
  styleUrls: ['./cafet-admin.component.css']
})
export class CafetAdminComponent implements OnInit, OnDestroy {

  users: CafetUser[];
  usersWithAccount: CafetUser[];
  usersWithNoAccount: CafetUser[];
  displayedUsers: CafetUser[] = [];

  search: FormControl;
  controls: {[emailId: string]: {
    add: FormControl,
    sub: FormControl
  }};
  expanded: {[emailId: string]: boolean};

  usersWatcher: any;

  pageIndex: number = 0;
  pageSize: number = 20;

  constructor(
    public cafet: CafetService,
    public tools: ToolsService,
    public media: DeviceSizeService,
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
          add: new FormControl("", [Validators.required]),
          sub: new FormControl("", [Validators.required])
        };
        this.expanded[user.emailId] = false;
      }
      this.usersWithAccount = users.filter(user => user.activated);
      this.usersWithNoAccount = users.filter(user => !user.activated);
      this.search.setValue("");
      this.sortUsers("");
    })
  }

  transaction(user: CafetUser, add: boolean) {
    let value;
    if (add){
      value = this.controls[user.emailId].add.value;
    } else {
      value = -this.controls[user.emailId].sub.value;
    }
    this.controls[user.emailId].add.setValue("");
    this.controls[user.emailId].sub.setValue("");
    this.expanded[user.emailId] = false;
    this.cafet.newTransaction(user, value);
  }

  activateAccount(user: CafetUser) {
    if (this.controls[user.emailId].add.valid) {
      user.credit = this.controls[user.emailId].add.value;
      user.activated = true;
      this.controls[user.emailId].add.setValue("");
      this.cafet.setUserAccount(user);
    }
  }

  createSearchForm() {
    this.search = new FormControl();
    this.search.valueChanges.subscribe(name => {
      this.sortUsers(name);
    })
  }

  sortUsers(name: string) {
    let emailId = name.replace(' ', '|').toLowerCase();
    this.pageIndex = 0;
    this.displayedUsers = this.usersWithAccount.filter(
      user => user.emailId.includes(emailId)
    );
  }

  updateList(event) {
    this.pageIndex = event.pageIndex;
  }

}
