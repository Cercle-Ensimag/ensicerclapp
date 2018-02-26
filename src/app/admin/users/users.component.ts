import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { DeviceSizeService } from '../../providers/device-size.service'
import { AdminService } from '../admin-service/admin.service';
import { DicoService } from '../../language/dico.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class AdminUsersComponent implements OnInit {

  voteAdmin: {[uid: string]: boolean};
  eventsAdmin: {[uid: string]: boolean};
  cafetAdmin: {[uid: string]: boolean};

  displayedUsers: any[] = [];
  search: FormControl;
  voteAdminCtrl: FormControl;
  eventsAdminCtrl: FormControl;
  cafetAdminCtrl: FormControl;
  voteAdminChecked: boolean;
  eventsAdminChecked: boolean;
  cafetAdminChecked: boolean;

  pageIndex: number = 0;
  pageSize: number = 20;

  constructor(
    public admin: AdminService,
    public d: DicoService,
    public media: DeviceSizeService
  ) {
    this.voteAdmin = {};
    this.eventsAdmin = {};
    this.cafetAdmin = {};
  }

  ngOnInit() {
    this.createSearchForm();
    this.admin.start();
  }

  ngOnDestroy() {
    this.admin.stop();
  }

  createSearchForm() {
    this.search = new FormControl();
    this.voteAdminCtrl = new FormControl();
    this.eventsAdminCtrl = new FormControl();
    this.cafetAdminCtrl = new FormControl();
    this.search.valueChanges.subscribe(name => {
      this.sortUsers(name);
    })
    this.voteAdminCtrl.valueChanges.subscribe(checked => {
      this.voteAdminChecked = checked;
      this.sortUsers(this.search.value || "");
    })
    this.eventsAdminCtrl.valueChanges.subscribe(checked => {
      this.eventsAdminChecked = checked;
      this.sortUsers(this.search.value || "");
    })
    this.cafetAdminCtrl.valueChanges.subscribe(checked => {
      this.cafetAdminChecked = checked;
      this.sortUsers(this.search.value || "");
    })
  }

  sortUsers(name: string) {
    let emailId = name.replace(' ', '|').toLowerCase();
    this.pageIndex = 0;
    this.displayedUsers = this.admin.users.filter(
      user => (this.testEmailIds(emailId, user))
    );
  }

  testEmailIds(emailId, user) {
    let userData = user[user.uid];
    if (userData){
      let emailId2 = userData.admin.email.split('@')[0].replace('.', '|')
      if (userData.admin["vote-admin"] != true && this.voteAdminChecked == true) {
        return false;
      }
      if (userData.admin["events-admin"] != true && this.eventsAdminChecked == true) {
        return false;
      }
      if (userData.admin["cafet-admin"] != true && this.cafetAdminChecked == true) {
        return false;
      }
      return emailId2.includes(emailId);
    }
    return false;
  }

  setVoteAdmin(email: string, uid: string, checked: boolean) {
    this.voteAdmin[uid] = checked;
    this.admin.setVoteAdmin(email, uid, checked);
  }

  setEventsAdmin(email: string, uid: string, checked: boolean) {
    this.eventsAdmin[uid] = checked;
    this.admin.setEventsAdmin(email, uid, checked);
  }

  setCafetAdmin(email: string, uid: string, checked: boolean) {
    this.cafetAdmin[uid] = checked;
    this.admin.setCafetAdmin(email, uid, checked);
  }

  voteChecked(user: any) {
    if (typeof this.voteAdmin[user.uid] === 'undefined'){
      return user[user.uid]['admin']['vote-admin'] || false;
    } else {
      return this.voteAdmin[user.uid];
    }
  }
  eventsChecked(user: any) {
    if (typeof this.eventsAdmin[user.uid] === 'undefined'){
      return user[user.uid]['admin']['events-admin'] || false;
    } else {
      return this.eventsAdmin[user.uid];
    }
  }
  cafetChecked(user: any) {
    if (typeof this.cafetAdmin[user.uid] === 'undefined'){
      return user[user.uid]['admin']['cafet-admin'] || false;
    } else {
      return this.cafetAdmin[user.uid];
    }
  }

  titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
  }

  getName(user: any): string {
    return this.titleCase(
      user[user.uid].admin.email
      .split('@')[0].split('.').join(' ')
      .replace('1', '').replace('2', '').replace('3', '')
    );
  }

  updateList(event) {
    this.pageIndex = event.pageIndex;
  }
}
