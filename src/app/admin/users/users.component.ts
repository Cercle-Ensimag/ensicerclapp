import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

import {ToolsService} from '../../providers/tools.service';
import {DeviceSizeService} from '../../providers/device-size.service';
import {AdminService} from '../admin-service/admin.service';
import {DicoService} from '../../language/dico.service';
import {Observable} from '../../../../node_modules/rxjs';
import {User} from 'firebase/app';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class AdminUsersComponent implements OnInit {
  public formGroup: FormGroup;
  public expandedUserUid: string = '';
  public adminsStrings: string[] = ['vote', 'events', 'actus', 'cafet', 'nsigma', 'annonces'];

  constructor(
    private fb: FormBuilder,

    public admin: AdminService,
    public d: DicoService,
    public tools: ToolsService,
    public media: DeviceSizeService
  ) { }

  ngOnInit() {
    this.initSearchForm();
  }

  initSearchForm() {
    const controlsConfig = {
      search: ['', []]
    };
    this.adminsStrings.forEach((adminString: string) => { controlsConfig[adminString + 'Admins'] = ['', []] });

    this.formGroup = this.fb.group(controlsConfig);
  }

  filteredUsers(): Observable<User[]> {
    return this.admin.getUsers()
        .map(users => {
          const emailId = this.formGroup.get('search').value.replace(' ', '|').toLowerCase();
          return users.filter(
            user => (this.checkAgainstFilters(emailId, user))
          );
        })
        .shareReplay(1);
  }

  checkAgainstFilters(emailId, user) {
    let userData = user[user.uid];
    if (!userData) return false;

    for (const admin of this.adminsStrings){
      if (!this.isUserAdminOf(user, admin) && this.formGroup.get(admin + 'Admins').value) {
        return false;
      }
    }

    const emailId2 = userData.admin.email.split('@')[0].replace('.', '|');
    return emailId2.includes(emailId);
  }

  setExpanded(uid: string){
    this.expandedUserUid = uid;
  }

  setUserAdminOf(email: string, uid: string, of: string, checked: boolean) {
    this.admin.setUserAdminOf(email, uid, of, checked);
  }

  isUserAdminOf(user: any, of: string) {
    return user[user.uid]['admin'][of + '-admin'] === true;
  }

  getName(user: any): string {
    return this.tools.titleCase(
      user[user.uid].admin.email
      .split('@')[0].split('.').join(' ')
      .replace(/[0-9]/g, "")
    );
  }
}
