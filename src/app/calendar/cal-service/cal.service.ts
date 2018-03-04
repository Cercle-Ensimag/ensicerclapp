import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireDatabase } from 'angularfire2/database';

import { AuthService } from '../../auth/auth-service/auth.service';
import { EventsService } from '../../events/events-service/events.service';
import { Event } from '../../events/events-home/events-home.component';

import * as parseICS from 'ics-parser';

const LINK = "https://edt.grenoble-inp.fr/directCal/2017-2018/exterieur?resources=15711,14992,14225,14226,14223,16819,17042,14239,14240,16612,16450,13769,13772,13753,13750,3222,16303,13880,14123,14129,14175,14059,16319,16317,17131,17184,16336,16404,17048,14204,14202,14208,14220,14221,14218,17025,17028,17026,18750,18746,13680,13682,13679,18346,13188,13193,16881,16880,16989,12957,13107,13078,13094,18828,18827,18023,17925,17921,18339,18768,10341,8527,8769";

const CAL =
""

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
  assos: CalEvent[] = [];
  persos: CalEvent[] = [];

  assosEventsIds: AssoEventIds = {};

  coursesWatcher: any;
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
      this.coursesWatcher || this.assosWatcher ||
      this.assosEventsIdsWatcher || this.persosWatcher
    ) {
      this.stop();
    }
    this.coursesWatcher = this.watchCoursesEvents();
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

  watchCoursesEvents() {
    this.courses = parseICS(CAL).map(event => new CalEvent(
      "", event.name, event.startDate, event.endDate, event.location, COURSE
    )) || [];
    this.concatEvents();
    return null;
    // return this.http.get(LINK).subscribe(
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
}
