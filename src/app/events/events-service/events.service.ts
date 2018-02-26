import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { AuthService } from '../../auth/auth-service/auth.service';
import { Event } from '../events-home/events-home.component';
import { ComResp } from '../event-admin/event-admin.component';

@Injectable()
export class EventsService {

  events: Event[] = [];
  eventsWatcher: any;

  constructor(
    private db: AngularFireDatabase,
    private auth: AuthService
  ) { }

  start() {
    if (this.eventsWatcher) {
      this.stop();
    }
    this.eventsWatcher = this.watchEvents();
  }

  stop() {
    if (this.eventsWatcher) {
      this.eventsWatcher.unsubscribe();
      this.eventsWatcher = null;
    }
  }

  watchEvents() {
    return this.db.list<Event>('events/events').valueChanges().subscribe(
      events => {
        this.events = events || [];
      },
      err => {}
    );
  }

  getEvent(eventId: string) {
    return this.db.object<Event>('events/events/'+eventId).valueChanges();
  }

  deleteEvent(eventId: string) {
    return this.db.object<Event>('events/events/'+eventId).set(null);
  }

  getComResps() {
    return this.db.list<ComResp>('events/com-resps').valueChanges();
  }

  removeComResp(emailId: string) {
    return this.db.object<ComResp>('events/com-resps/'+emailId).remove();
  }

  addComResp(email: string) {
    let emailId = this.auth.getEmailIdFromEmail(email);
    return this.db.object<ComResp>('events/com-resps/'+emailId).set({emailId: emailId});
  }


}
