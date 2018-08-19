import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import { ToolsService } from '../../providers/tools.service';
import { DeviceSizeService } from '../../providers/device-size.service'
import { AdminService } from '../admin-service/admin.service';
import { DicoService } from '../../language/dico.service';
import {Observable, Subscription} from '../../../../node_modules/rxjs';
import {User} from 'firebase/app';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class AdminUsersComponent implements OnInit {

  admins: {
    [typeOfAdmin: string]: {[uid: string]: boolean}
  };

  adminsStrings: string[] = ['vote', 'events', 'actus', 'cafet', 'nsigma', 'annonces'];

  displayedUsers: any[];
  users: any[];
  usersCtrl: FormGroup;
  usersCtrlWatcher: any;
  usersWatcher: Subscription;

  pageIndex: number = 0;
  pageSize: number = 20;

  constructor(
    public admin: AdminService,
    public d: DicoService,
    private tools: ToolsService,
    public media: DeviceSizeService,
    private fb: FormBuilder
  ) {
    this.admins = {};
    this.adminsStrings.forEach((adminString: string) => { this.admins[adminString] = {} });
  }

  ngOnInit() {
    this.watchSearchForm();
    this.usersWatcher = this.admin.getUsers().subscribe((users: User[]) => {
      this.users = users;
      this.filterUsers();
    });

  }

  ngOnDestroy() {
    this.usersWatcher.unsubscribe();
    this.usersCtrlWatcher.unsubscribe();
  }

  watchSearchForm() {
    const controlsConfig = {
      search: ['', []]
    };
    this.adminsStrings.forEach((adminString: string) => { controlsConfig[adminString + 'Admins'] = ['', []] });

    this.usersCtrl = this.fb.group(controlsConfig);

    if (this.usersCtrlWatcher) {
      this.usersCtrlWatcher.unsubscribe();
    }
    this.usersCtrlWatcher = this.usersCtrl.valueChanges.subscribe(() => {
      this.filterUsers();
    });
  }

  filterUsers() {
    let emailId = this.usersCtrl.get('search').value.replace(' ', '|').toLowerCase();
    this.pageIndex = 0;
    this.displayedUsers = this.users.filter(
      user => (this.checkAgainstFilters(emailId, user))
    );
  }

  checkAgainstFilters(emailId, user) {
    let userData = user[user.uid];
    if (!userData) return true;

    for (const admin of this.adminsStrings){
      if (userData.admin[admin + '-admin'] != true && this.usersCtrl.get(admin + 'Admins').value) {
        return false;
      }
    }

    const emailId2 = userData.admin.email.split('@')[0].replace('.', '|');
    return emailId2.includes(emailId);
  }

  setUserAdminOf(email: string, uid: string, of: string, checked: boolean) {
    this.admins[of][uid] = checked;
    this.admin.setUserAdminOf(email, uid, of, checked);
  }

  isUserAdminOf(user: any, of: string) {
    if (typeof this.admins[of][user.uid] === 'undefined'){
      return user[user.uid]['admin'][of + '-admin'] || false;
    } else {
      return this.admins[of][user.uid];
    }
  }

  getName(user: any): string {
    return this.tools.titleCase(
      user[user.uid].admin.email
      .split('@')[0].split('.').join(' ')
      .replace('1', '').replace(/[0-9]/g, "")
    );
  }

  updateList(event) {
    this.pageIndex = event.pageIndex;
  }
}
