import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireDatabase } from 'angularfire2/database';

import { AuthService } from '../../auth/auth-service/auth.service';
import { EventsService } from '../../events/events-service/events.service';
import { Event } from '../../events/events-home/events-home.component';

import * as parseICS from 'ics-parser';

import { environment } from '../../../environments/environment';

export const COURSE = "course";
export const PERSOS = "persos";
export const ASSOS = "assos";

export class CalEvent {
  id: string;
  title: string;
  start: number;
  end: number;
  location: string;
  type: string;
  // description: string;
  // end: string;

  constructor(
    id: string, name: string, start: any, end: any, loc: string, type: string
  ) {
    this.id = id;
    this.title = name;
    this.start = (new Date(start)).getTime();
    this.end = (new Date(end)).getTime();
    this.location = loc;
    this.type = type;
  }

  isAssos() {
    return this.type === ASSOS;
  }

  isPerso() {
    return this.type === PERSOS;
  }

  isCourse() {
    return this.type === COURSE;
  }
}

class AssoEventIds {
  [eventId: string]: string;
}

@Injectable()
export class CalService {

  calEvents: CalEvent[] = [];

  courses: CalEvent[] = [];
  resources: string = "";
  assos: CalEvent[] = [];
  persos: CalEvent[] = [];

  assosEventsIds: AssoEventIds = {};

  coursesWatcher: any;
  resourcesWatcher: any;
  assosWatcher: any;
  assosEventsIdsWatcher: any;
  persosWatcher: any;

  constructor(
    private auth: AuthService,
    private db: AngularFireDatabase,
    private events: EventsService,
    private http: HttpClient
  ) { }

  start () {
    if (
      this.coursesWatcher || this.resourcesWatcher || this.assosWatcher ||
      this.assosEventsIdsWatcher || this.persosWatcher
    ) {
      this.stop();
    }
    this.resourcesWatcher = this.watchResources();
    this.assosWatcher = this.watchAssosEvents();
    this.assosEventsIdsWatcher = this.watchAssosEventsIds();
    this.persosWatcher = this.watchPersoEvents();
  }

  stop() {
    if (this.coursesWatcher) {
      this.coursesWatcher.unsubscribe();
      this.coursesWatcher = null;
    }
    if (this.assosWatcher) {
      this.assosWatcher.unsubscribe();
      this.assosWatcher = null;
    }
    if (this.assosEventsIdsWatcher) {
      this.assosEventsIdsWatcher.unsubscribe();
      this.assosEventsIdsWatcher = null;
    }
    if (this.persosWatcher) {
      this.persosWatcher.unsubscribe();
      this.persosWatcher = null;
    }
  }

  watchResources() {
    return this.getResources().subscribe(
      resources => {
        if (this.coursesWatcher) {
          this.coursesWatcher.unsubscribe();
          this.coursesWatcher = null;
        }
        console.log(this.getCoursesURL(resources));
        if (resources != null) {
          this.coursesWatcher = this.watchCoursesEvents(resources);
        }
      }
    )
  }

  watchCoursesEvents(resources: string) {
    this.courses = parseICS("").map(event => new CalEvent(
      "", event.name, event.startDate, event.endDate, event.location, COURSE
    )) || [];
    this.concatEvents();
    return null;
    // return this.http.get(this.getCoursesURL(resources)).subscribe(
    //   cal => {
    //     this.events = parseICS(cal);
    //   },
    //   err => { console.log(err); }
    // )
  }

  watchAssosEvents() {
    return this.events.getEvents().subscribe(
      events => {
        this.assos = events
        .map(event => {
          let calEvent = new CalEvent(
            event.id, event.title, event.start, event.end, event.location, ASSOS
          );
          return calEvent;
        }) || [];
        this.concatEvents();
      },
      err => {}
    );
  }

  watchAssosEventsIds() {
    return this.db.object<AssoEventIds>('calendar/users/'+this.auth.getEmailId()+'/assos').valueChanges().subscribe(
      ids => {
        this.assosEventsIds = ids || {};
        this.concatEvents();
      },
      err => {}
    )
  }

  watchPersoEvents() {
    return this.db.list<CalEvent>('calendar/users/'+this.auth.getEmailId()+'/perso').valueChanges().subscribe(
      events => {
        this.persos = events
        .map(event => {
          let calEvent = new CalEvent(
            event.id, event.title, event.start, event.end, event.location, PERSOS
          );
          return calEvent;
        }) || [];
        this.concatEvents();
      },
      err => {}
    )
  }

  getResources() {
    return this.db.object<string>('calendar/users/'+this.auth.getEmailId()+'/courses/resources').valueChanges();
  }

  setResources(resources: string) {
    return this.db.object<string>('calendar/users/'+this.auth.getEmailId()+'/courses/resources').set(resources);
  }

  getEvent(eventId: string) {
    return this.db.object<CalEvent>('calendar/users/'+this.auth.getEmailId()+'/perso/'+eventId).valueChanges();
  }

  getEventId() {
    return this.db.list<CalEvent>('calendar/users/'+this.auth.getEmailId()+'/perso/').push(null).key;
  }

  setEvent(event: CalEvent) {
    return this.db.object<CalEvent>('calendar/users/'+this.auth.getEmailId()+'/perso/'+event.id).set(event);
  }

  removeEvent(eventId: string) {
    return this.db.object<CalEvent>('calendar/users/'+this.auth.getEmailId()+'/perso/'+eventId).remove();
  }

  concatEvents() {
    this.calEvents = (this.courses.concat(this.persos).concat(
      this.assos.filter(event => event.id === this.assosEventsIds[event.id])
    ))
    .sort((event1, event2) => event1.start - event2.start);
  }

  getCoursesURL(resources: string) {
    if (resources == null) {
      return null;
    }
    return environment.proxi.domain + "?resources=" + resources;
  }

  resourcesValidator(resources: string) {
    if (!resources.match(/^[0-9]+(,[0-9])*/)) {
      return { error: true };
    }
    return null;
  }
}
