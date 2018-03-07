import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToolsService } from '../../providers/tools.service';
import { ListService } from '../../providers/list.service';
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
    this.controls[user.emailId].add.setValue("");
    this.controls[user.emailId].sub.setValue("");
    this.expanded[user.emailId] = false;
    this.cafet.newTransaction(user, value);
  }

  activateAccount(user: CafetUser) {
    if (this.controls[user.emailId].add.valid) {
      user.credit = this.controls[user.emailId].add.value;
      this.controls[user.emailId].add.setValue("");
      this.cafet.setUserAccount(user);
    }
  }

  createCafetAccount() {
    let emailId = this.tools.getEmailIdFromEmail(this.getSearchEmail());
    let name = this.tools.titleCase(emailId.replace('|', ' ').replace('  ', ' '));
    if (this.list.authUsers[emailId] !== this.getSearchEmail()) {
      this.error = this.d.format(this.d.l.notOnTheList, name);
    } else {
      this.cafet.setUserAccount({
        credit: this.getSearchCredit(),
        emailId: emailId
      });
      this.searchCtrl.get('email').setValue("");
      this.searchCtrl.get('credit').setValue("");
      this.error = this.d.format(this.d.l.markedAsVoted, name);
    }
  }

  createSearchForm() {
    this.searchCtrl = this.fb.group({
      email: ['', [Validators.email]],
      credit: ["", []]
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

}
