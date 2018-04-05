import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { DeviceSizeService } from '../../../providers/device-size.service';
import { CafetService, CafetResp } from '../../cafet-service/cafet.service';
import { AuthService } from '../../../auth/auth-service/auth.service';
import { ListService } from '../../../providers/list.service';
import { ToolsService } from '../../../providers/tools.service';
import { DicoService } from '../../../language/dico.service';

@Component({
  selector: 'app-cafet-admin-resps',
  templateUrl: './cafet-admin-resps.component.html',
  styleUrls: ['./cafet-admin-resps.component.css']
})
export class CafetAdminRespsComponent implements OnInit, OnDestroy {

  deleteActuId: string;
  deleteActuTitle: string;

  emailCtrl: FormControl;
  emailWatcher: any;

  cafetResps: CafetResp[];
  displayedUsers: CafetResp[];
  cafetRespsWatcher: any;

  error: string;

  constructor(
    private auth: AuthService,
    public tools: ToolsService,
    public cafet: CafetService,
    public media: DeviceSizeService,
    private list: ListService,
    public d: DicoService
  ) {
    this.deleteActuId = null;
  }

  ngOnInit () {
    this.cafetRespsWatcher = this.cafet.getCafetResps().subscribe(cafetResp => {
      this.cafetResps = cafetResp;
      this.sortUsers(this.emailCtrl.value);
    });
    this.createSearchForm();
    this.list.start();
  }

  ngOnDestroy () {
    this.cafetRespsWatcher.unsubscribe();
    this.list.stop();
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
    this.displayedUsers = this.cafetResps.filter(
      user => user.emailId.includes(emailId)
    );
  }

  addCafetResp() {
    if (!this.emailCtrl.invalid && this.displayedUsers.length == 0) {
      let emailId = this.tools.getEmailIdFromEmail(this.emailCtrl.value);
      if (!this.list.authUsers[emailId]) {
        let name = this.tools.titleCase(emailId.replace('|', ' ').replace('  ', ' '));
        this.error = this.d.format(this.d.l.notOnTheList, name);
      } else {
        this.cafet.addCafetResp({
          emailId: emailId
        });
        this.emailCtrl.setValue("");
      }
    }
  }

}
