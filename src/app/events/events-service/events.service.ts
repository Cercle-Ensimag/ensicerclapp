import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { ToolsService } from '../../providers/tools.service';
import { AuthService } from '../../auth/auth-service/auth.service';

export class Event {
  id: string;
  title: string;
  description: string;
  image: string;
  start: number;
  end: number;
  location: string;
  price: string;
  groupId: string;
}

export class ComResp {
  emailId: string;
  groupId: string;
}

export class Group {
  groupId: string;
  displayName: string;
}

@Injectable()
export class EventsService {

  events: Event[];
  activeEvents: Event[];
  eventsWatcher: any;

  constructor(
    private db: AngularFireDatabase,
    private tools: ToolsService,
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

  getEvents() {
    return this.db.list<Event>('events/events', ref => ref.orderByChild('start')).valueChanges();
  }

  watchEvents() {
    return this.getEvents().subscribe(
      events => {
        this.events = events || [];
        this.activeEvents = events.filter(event => event.end > Date.now()) || [];
      },
      err => {}
    );
  }

  getEvent(eventId: string) {
    return this.db.object<Event>('events/events/'+eventId).valueChanges();
  }

  getEventId() {
    return this.db.list<Event>('events/events/').push(null).key;
  }

  setEvent(event: Event) {
    return this.db.object<Event>('events/events/'+event.id).set(event);
  }

  deleteEvent(eventId: string) {
    return this.db.object<Event>('events/events/'+eventId).set(null);
  }

  getComResps() {
    return this.db.list<ComResp>('events/com-resps/resps').valueChanges();
  }

  removeComResp(emailId: string) {
    return this.db.object<ComResp>('events/com-resps/resps/'+emailId).remove();
  }

  addComResp(email: string, group: Group) {
    let emailId = this.tools.getEmailIdFromEmail(email);
    return this.db.object<Group>('events/com-resps/groups/'+group.groupId).set(group)
    .then(() => {
      return this.db.object<ComResp>('events/com-resps/resps/'+emailId).set({
        emailId: emailId,
        groupId: group.groupId
      });
    });
  }

  addEventToCalendar(eventId: string) {
    return this.db.object('calendar/users/'+this.auth.getEmailId()+'/assos/'+eventId).set(eventId);
  }

  removeEventFromCalendar(eventId: string) {
    return this.db.object('calendar/users/'+this.auth.getEmailId()+'/assos/'+eventId).set(null);
  }

  getEventInCalendar(eventId: string) {
    return this.db.object('calendar/users/'+this.auth.getEmailId()+'/assos/'+eventId).valueChanges();
  }

}
