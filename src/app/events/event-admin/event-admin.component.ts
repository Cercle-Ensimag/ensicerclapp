import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { DeviceSizeService } from '../../providers/device-size.service';
import { EventsService } from '../events-service/events.service';
import { AuthService } from '../../auth/auth-service/auth.service';
import { ListService } from '../../providers/list.service';
import { ToolsService } from '../../providers/tools.service';
import { DicoService } from '../../language/dico.service';

import { ComResp, Group } from '../events-service/events.service';

@Component({
  selector: 'app-event-admin',
  templateUrl: './event-admin.component.html',
  styleUrls: ['./event-admin.component.css']
})
export class EventAdminComponent implements OnInit, OnDestroy {

  deleteEventId: string;
  deleteEventTitle: string;

  emailCtrl: FormControl;
  emailWatcher: any;

  comResps: ComResp[];
  displayedUsers: ComResp[] = [];
  comRespsWatcher: any;

  error: string;

  constructor(
    private auth: AuthService,
    private events: EventsService,
    public media: DeviceSizeService,
    private list: ListService,
    public tools: ToolsService,
    public d: DicoService
  ) {
    this.deleteEventId = null;
  }

  ngOnInit () {
    this.events.start();
    this.comRespsWatcher = this.events.getComResps().subscribe(comResp => {
      this.comResps = comResp;
      this.sortUsers(this.emailCtrl.value);
    });
    this.createSearchForm();
    this.list.start();
  }

  ngOnDestroy () {
    this.events.stop();
    this.comRespsWatcher.unsubscribe();
    this.list.stop();
  }

  delete(eventId: string, eventTitle: string) {
    this.deleteEventId = eventId;
    this.deleteEventTitle = eventTitle;
  }

  back() {
    this.deleteEventId = null;
  }

  confirmDelete() {
    this.events.deleteEvent(this.deleteEventId);
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

  addComResp() {
    if (!this.emailCtrl.invalid && this.displayedUsers.length == 0) {
      let emailId = this.tools.getEmailIdFromEmail(this.emailCtrl.value);
      if (!this.list.authUsers[emailId]) {
        let name = this.tools.titleCase(emailId.replace('|', ' ').replace('  ', ' '));
        this.error = this.d.format(this.d.l.notOnTheList, name);
      } else {
        this.events.addComResp(this.emailCtrl.value, {
          groupId: emailId,
          displayName: emailId
        });
        this.emailCtrl.setValue("");
      }
    }
  }

}
