import { Component, OnInit } from '@angular/core';

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
  cafetAdmin: {[uid: string]: boolean};

  constructor(
    public admin: AdminService,
    public d: DicoService,
    public media: DeviceSizeService
  ) {
    this.voteAdmin = {};
    this.cafetAdmin = {};
  }

  ngOnInit() {
    this.admin.start();
  }

  ngOnDestroy() {
    this.admin.stop();
  }

  setVoteAdmin(email: string, uid: string, checked: boolean) {
    this.voteAdmin[uid] = checked;
    this.admin.setVoteAdmin(email, uid, checked);
  }

  setCafetAdmim(email: string, uid: string, checked: boolean) {
    this.cafetAdmin[uid] = checked;
    this.admin.setCafetAdmim(email, uid, checked);
  }

  voteChecked(user: any) {
    if (typeof this.voteAdmin[user.uid] === 'undefined'){
      return user[user.uid]['admin']['vote-admin'] || false;
    } else {
      return this.voteAdmin[user.uid];
    }
  }
  cafetChecked(user: any) {
    if (typeof this.cafetAdmin[user.uid] === 'undefined'){
      return user[user.uid]['admin']['cafet-admin'] || false;
    } else {
      return this.cafetAdmin[user.uid];
    }
  }
}
