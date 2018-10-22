
import {first, map} from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Location} from '@angular/common';

import {DeviceSizeService} from '../../providers/device-size.service';
import {EventsService} from '../events-service/events.service';
import {AuthService} from '../../auth/auth-service/auth.service';
import {ListService} from '../../providers/list.service';
import {ToolsService} from '../../providers/tools.service';
import {DicoService} from '../../language/dico.service';
import {Observable} from 'rxjs';
import {Assessor} from '../../vote/vote-admin/vote-admin.component';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-event-admin',
  templateUrl: './event-admin.component.html',
  styleUrls: ['./event-admin.component.css']
})
export class EventAdminComponent implements OnInit {
  public emailCtrl = new FormControl('', [this.auth.emailDomainValidator, Validators.email]);

  constructor(
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private list: ListService,

		public location: Location,
    public events: EventsService,
    public media: DeviceSizeService,
    public tools: ToolsService,
    public d: DicoService
  ) {  }

  ngOnInit () { }

  filteredUsers(): Observable<Assessor[]> {
    let emailId = this.tools.getEmailIdFromEmail(this.emailCtrl.value);
    return this.events.getComResps().pipe(
      map(users => users.filter(
        user => user.emailId.includes(emailId)
      )));
  }

  addComResp() {
    let emailId = this.tools.getEmailIdFromEmail(this.emailCtrl.value);
    this.list.isInList(this.emailCtrl.value)
      .pipe(first())
      .subscribe(inList => {
        if (!inList) {
          let name = this.tools.titleCase(emailId.replace('|', ' ').replace('  ', ' '));
          this.snackBar.open(this.d.format(this.d.l.notOnTheList, name), 'ok', {duration: 2000});
        } else {
          this.events.addComResp(this.emailCtrl.value, {
            groupId: emailId,
            displayName: emailId
          });
          this.emailCtrl.setValue('');
        }
      });
  }

}
