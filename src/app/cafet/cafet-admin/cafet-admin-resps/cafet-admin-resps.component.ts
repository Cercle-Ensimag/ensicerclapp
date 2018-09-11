import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

import {DeviceSizeService} from '../../../providers/device-size.service';
import {CafetService} from '../../cafet-service/cafet.service';
import {AuthService} from '../../../auth/auth-service/auth.service';
import {ListService} from '../../../providers/list.service';
import {ToolsService} from '../../../providers/tools.service';
import {DicoService} from '../../../language/dico.service';
import {Observable} from 'rxjs';
import {Assessor} from '../../../vote/vote-admin/vote-admin.component';
import {MatSnackBar} from '@angular/material';
import {first, map} from 'rxjs/operators';

@Component({
  selector: 'app-cafet-admin-resps',
  templateUrl: './cafet-admin-resps.component.html',
  styleUrls: ['./cafet-admin-resps.component.css']
})
export class CafetAdminRespsComponent implements OnInit {
  public emailCtrl: FormControl;

  constructor(
    private auth: AuthService,
    private list: ListService,
    private snackBar: MatSnackBar,


    public tools: ToolsService,
    public cafet: CafetService,
    public media: DeviceSizeService,
    public d: DicoService,
  ) { }

  ngOnInit () {
    this.emailCtrl = new FormControl('', [this.auth.emailDomainValidator, Validators.email]);
  }

  filteredUsers(): Observable<Assessor[]> {
    let emailId = this.tools.getEmailIdFromEmail(this.emailCtrl.value.split('@')[0]);
    return this.cafet.getCafetResps().pipe(
      map(users => users.filter(
        user => user.emailId.includes(emailId)
      )));
  }

  addCafetResp() {
    let emailId = this.tools.getEmailIdFromEmail(this.emailCtrl.value);
    this.list.isInList(this.emailCtrl.value)
      .pipe(first())
      .subscribe(inList => {
        if (!inList) {
          const name = this.tools.titleCase(emailId.replace('|', ' ').replace('  ', ' '));
          this.snackBar.open(this.d.format(this.d.l.notOnTheList, name), 'ok', {duration: 2000});
        } else {
          this.cafet.addCafetResp({
            emailId: emailId
          }).then(() => this.emailCtrl.reset());
        }
      });
  }

}
