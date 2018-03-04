import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { FormControl } from '@angular/forms';

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

export class Settings {
  resources: string;

  constructor(resources: string) {
    this.resources = resources;
  }
}

class AssoEventIds {
  [eventId: string]: string;
}

@Injectable()
export class CalService {

  calEvents: CalEvent[] = [];

  courses: CalEvent[] = [];
  settings: Settings;
  assos: CalEvent[] = [];
  persos: CalEvent[] = [];

  assosEventsIds: AssoEventIds = {};

  coursesWatcher: any;
  settingsWatcher: any;
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
      this.coursesWatcher || this.settingsWatcher || this.assosWatcher ||
      this.assosEventsIdsWatcher || this.persosWatcher
    ) {
      this.stop();
    }
    this.settingsWatcher = this.watchSettings();
    this.assosWatcher = this.watchAssosEvents();
    this.assosEventsIdsWatcher = this.watchAssosEventsIds();
    this.persosWatcher = this.watchPersoEvents();
  }

  stop() {
    if (this.coursesWatcher) {
      this.coursesWatcher.unsubscribe();
      this.coursesWatcher = null;
    }
    if (this.settingsWatcher) {
      this.settingsWatcher.unsubscribe();
      this.settingsWatcher = null;
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

  watchSettings() {
    return this.getSettings().subscribe(
      settings => {
        if (this.coursesWatcher) {
          this.coursesWatcher.unsubscribe();
        }
        if (settings != null){
          this.coursesWatcher = this.watchCoursesEvents(settings.resources);
        }
      }
    )
  }

  watchCoursesEvents(resources: string) {
    if (this.getCoursesURL(resources) == null) {
      return null;
    }
    return this.http.get(this.getCoursesURL(resources), { responseType: 'text' }).subscribe(
      cal => {
        this.courses = parseICS(cal).map(event => new CalEvent(
          "", event.name.replace(/\\,/g, ','), event.startDate, event.endDate, event.location, COURSE
        )) || [];
        this.concatEvents();
      },
      err => { console.log(err); }
    )
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

  getSettings() {
    return this.db.object<Settings>('calendar/users/'+this.auth.getEmailId()+'/settings').valueChanges();
  }

  setSettings(settings: Settings) {
    return this.db.object<Settings>('calendar/users/'+this.auth.getEmailId()+'/settings').set(settings);
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
    if (resources == null || resources === "") {
      return null;
    }
    return environment.proxy.domain + "?resources=" + resources;
  }

  resourcesValidator(control: FormControl) {
    if (!control.value.match(/^[0-9]+(,[0-9]+)*$/)) {
      return { error: true };
    }
    return null;
  }
}
