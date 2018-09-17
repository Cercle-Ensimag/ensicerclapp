import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

import {ToolsService} from '../../providers/tools.service';
import {AuthService} from '../../auth/auth-service/auth.service';
import {CalEvent} from '../../calendar/cal-service/cal.service';

import {first, map, mergeMap, shareReplay} from 'rxjs/operators';
import {combineLatest, from, Observable} from 'rxjs';

export class Event {
  id: string;
  title: string;
  description: string;
  image: string;
  start: number;
  end: number;
  location: string;
  price: string;
  asso: string;
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
  private _events: Observable<Event[]>;
  private _activeEvents: Observable<Event[]>;
  private _event: { [$eventId: string]: Observable<Event> } = {};
  private _comResps: Observable<ComResp[]>;
  private _eventInCalendar: { [$eventId: string]: Observable<CalEvent> } = {};

  constructor(
    private db: AngularFireDatabase,
    private tools: ToolsService,
    private auth: AuthService
  ) {
  }

  getEvents(): Observable<Event[]> {
    if (!this._events) {
      this._events = this.db
        .list<Event>('events/events', ref => ref.orderByChild('start'))
        .valueChanges().pipe(
          map((events: Event[]) => events.reverse()), // Pour l'admin, on veut voir les passés en dernier.
          shareReplay(1));
    }
    return this._events;
  }

  getActiveEvents(): Observable<Event[]> {
    if (!this._activeEvents) {
      this._activeEvents = this.getEvents().pipe(
        // Il faut les plus proches en haut
        map((events: Event[]) => events.filter(event => event.end > Date.now()).reverse()),
        shareReplay(1));
    }
    return this._activeEvents;
  }

  getEventsImRespoOf(): Observable<Event[]> {
    return combineLatest(
      this.getEvents(),
      this.auth.getRespComId()
    ).pipe(
      map(([events, comId]: [Event[], string]) => events.filter(event => event.groupId === comId)));
  }

  getEvent(eventId: string): Observable<Event> {
    if (!this._event[eventId]) {
      this._event[eventId] = this.db
        .object<Event>('events/events/' + eventId)
        .valueChanges()
        .pipe(shareReplay(1));
    }
    return this._event[eventId];
  }

  getEventId() {
    return this.db.list<Event>('events/events/').push(null).key;
  }

  setEvent(event: Event) {
    return this.db.object<Event>('events/events/' + event.id).set(event);
  }

  deleteEvent(eventId: string) {
    return this.db.object<Event>('events/events/' + eventId).set(null);
  }

  getComResps(): Observable<ComResp[]> {
    if (!this._comResps) {
      this._comResps = this.db
        .list<ComResp>('events/com-resps/resps')
        .valueChanges()
        .pipe(shareReplay(1));
    }
    return this._comResps;
  }

  removeComResp(emailId: string) {
    return this.db.object<ComResp>('events/com-resps/resps/' + emailId).remove();
  }

  addComResp(email: string, group: Group) {
    let emailId = this.tools.getEmailIdFromEmail(email);
    return this.db.object<Group>('events/com-resps/groups/' + group.groupId).set(group)
      .then(() => {
        return this.db.object<ComResp>('events/com-resps/resps/' + emailId).set({
          emailId: emailId,
          groupId: group.groupId
        });
      });
  }

  addEventToCalendar(eventId: string) {
    return this.auth.getUser().pipe(
      first(),
      mergeMap(user => from(
        this.db.object('calendar/users/' + user.uid + '/assos/' + eventId).set(eventId)
      )),)
      .toPromise();
  }

  removeEventFromCalendar(eventId: string) {
    return this.auth.getUser().pipe(
      first(),
      mergeMap(user => from(
        this.db.object('calendar/users/' + user.uid + '/assos/' + eventId).set(null)
      )),)
      .toPromise();
  }

  getEventInCalendar(eventId: string): Observable<CalEvent> {
    if (!this._eventInCalendar[eventId]) {
      this._eventInCalendar[eventId] = this.auth.getUser().pipe(
        mergeMap(user =>
          this.db.object<CalEvent>('calendar/users/' + user.uid + '/assos/' + eventId).valueChanges()
        ))
        .pipe(shareReplay(1));
    }
    return this._eventInCalendar[eventId];
  }

}
