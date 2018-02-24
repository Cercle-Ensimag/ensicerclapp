import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { AuthService } from '../../auth/auth-service/auth.service';
import { Event } from '../events-home/events-home.component';

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
    return this.db.list<Event>('events').valueChanges().subscribe(events => {
      this.events = events;
    });
  }

  getEvent(eventId) {
    return this.db.object<Event>('events/'+eventId).valueChanges();
  }


}
