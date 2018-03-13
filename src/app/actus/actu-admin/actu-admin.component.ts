import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { DeviceSizeService } from '../../providers/device-size.service';
import { ActusService } from '../actus-service/actus.service';
import { AuthService } from '../../auth/auth-service/auth.service';
import { ListService } from '../../providers/list.service';
import { ToolsService } from '../../providers/tools.service';
import { DicoService } from '../../language/dico.service';

export class Journalist {
  emailId: string;
  groupId: string;
}

export class Group {
  groupId: string;
  displayName: string;
}

@Component({
  selector: 'app-actu-admin',
  templateUrl: './actu-admin.component.html',
  styleUrls: ['./actu-admin.component.css']
})
export class ActuAdminComponent implements OnInit, OnDestroy {

  deleteActuId: string;
  deleteActuTitle: string;

  emailCtrl: FormControl;
  emailWatcher: any;

  comResps: Journalist[];
  displayedUsers: Journalist[];
  comRespsWatcher: any;

  error: string;

  constructor(
    private auth: AuthService,
    public tools: ToolsService,
    public actus: ActusService,
    public media: DeviceSizeService,
    private list: ListService,
    public d: DicoService
  ) {
    this.deleteActuId = null;
  }

  ngOnInit () {
    this.actus.start();
    this.comRespsWatcher = this.actus.getJournalists().subscribe(comResp => {
      this.comResps = comResp;
      this.sortUsers(this.emailCtrl.value);
    });
    this.createSearchForm();
    this.list.start();
  }

  ngOnDestroy () {
    this.actus.stop();
    this.comRespsWatcher.unsubscribe();
    this.list.stop();
  }

  delete(actuId: string, actuTitle: string) {
    this.deleteActuId = actuId;
    this.deleteActuTitle = actuTitle;
  }

  back() {
    this.deleteActuId = null;
  }

  confirmDelete() {
    this.actus.deleteActu(this.deleteActuId);
    this.back();
  }

  createSearchForm() {
    this.emailCtrl = new FormControl('', [this.auth.emailDomainValidator, Validators.email]);
    this.emailCtrl.valueChanges.subscribe((email) => {
      this.sortUsers(email);
      this.error = null;
    });
  }

  sortUsers(email: string) {
    let emailId = this.tools.getEmailIdFromEmail(email.split('@')[0]);
    this.displayedUsers = this.comResps.filter(
      user => user.emailId.includes(emailId)
    );
  }

  addJournalist() {
    if (!this.emailCtrl.invalid && this.displayedUsers.length == 0) {
      let emailId = this.tools.getEmailIdFromEmail(this.emailCtrl.value);
      if (!this.list.authUsers[emailId]) {
        let name = this.tools.titleCase(emailId.replace('|', ' ').replace('  ', ' '));
        this.error = this.d.format(this.d.l.notOnTheList, name);
      } else {
        this.actus.addJournalist(this.emailCtrl.value, {
          groupId: emailId,
          displayName: emailId
        });
        this.emailCtrl.setValue("");
      }
    }
  }

}
