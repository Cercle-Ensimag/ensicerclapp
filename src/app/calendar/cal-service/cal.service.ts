import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AngularFireDatabase} from '@angular/fire/database';
import {FormControl} from '@angular/forms';

import {AuthService} from '../../auth/auth-service/auth.service';
import {EventsService} from '../../events/events-service/events.service';

import * as parseICS from 'ics-parser';

import {environment} from '../../../environments/environment';

import {combineLatest, merge, of, from, EMPTY, Observable, Subject} from 'rxjs';
import {first, map, catchError, mergeMap, shareReplay, tap} from 'rxjs/operators';
import {ToolsService} from '../../providers/tools.service';

export const COURSE = "course";
export const PERSOS = "persos";
export const ASSOS = "assos";

const DAY_LENGTH = 24 * 60 * 60* 1000;
const WEEK_LENGTH = 7 * DAY_LENGTH;

export class CalEvent {
  id: string;
  title: string;
  start: number;
  end: number;
  occurences: number;
  location: string;
  type: string;

  constructor(
    id: string, name: string, start: any, end: any, occurences: number,
    loc: string, type: string
  ) {
    this.id = id;
    this.title = name;
    this.start = (new Date(start)).getTime();
    this.end = (new Date(end)).getTime();
    this.occurences = occurences;
    this.location = loc;
    this.type = type;
  }

  isNow(): boolean{
    return this.start < Date.now() && this.end > Date.now();
  }

  isSingleDay(): boolean {
    const eventStartDay = new Date(this.start).setHours(0,0,0,0);
    const eventEndDay = new Date(this.end).setHours(0,0,0,0);
    return eventStartDay == eventEndDay;
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

class ICSEvent {
	name: string;
	startDate: any;
	endDate: any;
	location: any;
}

@Injectable()
export class CalService {
  private _coursesEvents: Observable<CalEvent[]>;
  private _assosEvents: Observable<CalEvent[]>;
  private _persosEvents: Observable<CalEvent[]>;
  private _assosEventsITakePart: Observable<CalEvent[]>;
  private _myEvents: Observable<CalEvent[]>;
  private _calFromAde: Observable<string>;
  private _myEventsForDay: { [$dayString: string]: Observable<CalEvent[]> } = {};
  private _settings: Observable<Settings>;
  private _event: { [$eventId: string]: Observable<CalEvent> } = {};
	private _eventIdsWithNoEvents: Observable<string[]>;
	private _errorNotifier: Subject<string> = new Subject<string>();

  constructor(
    private auth: AuthService,
    private db: AngularFireDatabase,
    private events: EventsService,
    private tools: ToolsService,
    private http: HttpClient
  ) { }

	getErrors(): Subject<string> {
		return this._errorNotifier;
	}

  getCoursesEvents(): Observable<CalEvent[]> {
    if (!this._coursesEvents) {
      this._coursesEvents = this.getSettings().pipe(
        mergeMap((settings: Settings) => {
          if (!settings || !settings.resources){
            return of([]);
          }
          return this.getCalFromAde(settings.resources).pipe(
						catchError(
							() => {
								this._errorNotifier.next("ADE update failed");
								return EMPTY;
							}
						),
            map(cal => parseICS(cal).map((event: ICSEvent) => new CalEvent(
							'',
							event.name.replace(/\\,/g, ', '),
							event.startDate,
							event.endDate,
							1,
							event.location.replace(/\\,/g, ', '),
							COURSE
						)))
					)
        }),
        shareReplay(1)
			);
    }
    return this._coursesEvents;
  }

  getAssosEvents(): Observable<CalEvent[]> {
    if (!this._assosEvents) {
      this._assosEvents = this.events.getEvents().pipe(
				map(events => events.map(event => new CalEvent(
          event.id, event.title, event.start, event.end, 1, event.location, ASSOS
        ))),
        shareReplay(1)
			);
    }
    return this._assosEvents;
  }

  getAssosEventsITakePart(): Observable<CalEvent[]> {
    if (!this._assosEventsITakePart) {
      this._assosEventsITakePart = combineLatest(
        this.auth.getUser().pipe(
          mergeMap(user => this.db.list<string>('calendar/users/'+user.uid+'/assos').valueChanges())
				),
        this.getAssosEvents()
			).pipe(
        map(
					([ids, events]: [string[], CalEvent[]]): CalEvent[] =>
          events.filter((event: CalEvent): boolean => ids.includes(event.id))
				),
        shareReplay(1)
			);
    }
    return this._assosEventsITakePart;
  }

  getPersosEvents(): Observable<CalEvent[]> {
    if (!this._persosEvents) {
      this._persosEvents = this.auth.getUser().pipe(
        mergeMap(
					user =>
					this.db.list<CalEvent>('calendar/users/'+user.uid+'/perso')
					.valueChanges()
				),
        // Duplicate events with multiple occurrences
        map(events => {
          const toReturn = [];
          events.forEach(event => {
            for (let i = 0; i < event.occurences; i++){
              toReturn.push(new CalEvent(
                event.id,
								event.title,
								event.start + WEEK_LENGTH * i,
								event.end + WEEK_LENGTH * i,
								1,
								event.location,
								PERSOS
              ));
            }
          });
          return toReturn.sort((event1, event2) => event1.start - event2.start);
        }),
        shareReplay(1)
			);
    }
    return this._persosEvents;
  }

  getMyEvents(): Observable<CalEvent[]> {
    if (!this._myEvents){
      this._myEvents = this.tools.enableCache(
        combineLatest(
          this.getAssosEventsITakePart(),
          this.getCoursesEvents(),
          this.getPersosEvents()
				).pipe(
					map(
						([asso, courses, perso]: [CalEvent[], CalEvent[], CalEvent[]]) =>
	          asso.concat(courses).concat(perso).sort((event1, event2) => event1.start - event2.start)
					)
				),
        '_myEvents',
        true,
        event => new CalEvent(
          event.id,
          event.title,
          event.start,
          event.end,
          event.occurences,
          event.location,
          event.type
        )
			).pipe(shareReplay(1));
    }
    return this._myEvents;
  }

  getMyEventsForDay(date: Date): Observable<CalEvent[]>{
    const startOfDay = new Date(date.getTime()).setHours(0,0,0,0);
    const endOfDay = new Date(date.getTime()).setHours(23,59,59,999);
    const dayString = startOfDay.toLocaleString().split(' ')[0];

    if (!this._myEventsForDay[dayString]){
      this._myEventsForDay[dayString] = this.getMyEvents().pipe(
        map((events: CalEvent[]) => events.filter((event: CalEvent) => event.start < endOfDay && event.end > startOfDay)),
        shareReplay(1)
			);
    }
    return this._myEventsForDay[dayString]
  }

  getCalFromAde(resources: string): Observable<string> {
    if (!this._calFromAde){
      this._calFromAde = this.tools.enableCache(
        this.http.get(this.getCoursesURL(resources), { responseType: 'text' }),
        '_calFromADE',
        false
			).pipe(shareReplay(1));
    }
    return this._calFromAde;
  }

  getSettings() {
    if (!this._settings){
      this._settings = this.auth.getLoggedUser().pipe(
        mergeMap(
					user => this.db
					.object<Settings>('calendar/users/'+user.uid+'/settings')
					.valueChanges()
				),
        shareReplay(1)
			);
    }
    return this._settings;
  }

  setSettings(settings: Settings) {
    return this.auth.getLoggedUser().pipe(
      first(),
      mergeMap(user => from(
        this.db.object<Settings>('calendar/users/'+user.uid+'/settings').set(settings)
      ))
		).toPromise();
  }

  getEvent(eventId: string) {
    if (!this._event[eventId]){
      this._event[eventId] = this.auth.getLoggedUser().pipe(
        mergeMap(
					user =>
          this.db.object<CalEvent>('calendar/users/'+user.uid+'/perso/'+eventId)
          .valueChanges()
				),
        shareReplay(1)
			);
    }
    return this._event[eventId];
  }

  getEventId(): Observable<string> {
    return this.auth.getLoggedUser().pipe(
      first(),
      map(
				user =>
      	this.db.list<CalEvent>('calendar/users/'+user.uid+'/perso/').push(null).key
			)
		);
  }

  setEvent(event: CalEvent) {
    return this.auth.getLoggedUser().pipe(
      first(),
      mergeMap(user => from(
        this.db.object<CalEvent>('calendar/users/'+user.uid+'/perso/'+event.id).set(event)
      ))
		).toPromise();
  }

  removeEvent(eventId: string) {
    return this.auth.getLoggedUser().pipe(
      first(),
      mergeMap(user => from(
        this.db.object<CalEvent>('calendar/users/'+user.uid+'/perso/'+eventId).remove()
      ))
		).toPromise();
  }

  getCoursesURL(resources: string) {
    if (resources == null || resources === '') {
      return null;
    }
    return environment.proxy.domain + "action=fetch_edt&resources=" + resources;
  }

  resourcesValidator(control: FormControl) {
    if (!control.value.match(/^[0-9]*(,[0-9]+)*$/)) {
      return { error: true };
    }
    return null;
  }

	getEventIdsWithNoEvents(): Observable<string[]> {
    if (!this._eventIdsWithNoEvents) {
      this._eventIdsWithNoEvents = combineLatest(
        this.auth.getUser().pipe(
          mergeMap(user => this.db.list<string>('calendar/users/'+user.uid+'/assos').valueChanges())
				),
        this.getAssosEvents().pipe(
					map(events => events.map(event => event.id))
				)
			)
      .pipe(
        map(
					([ids, eventIds]: [string[], string[]]): string[] =>
					ids.filter((id: string): boolean => !eventIds.includes(id))
				),
        shareReplay(1)
			);
    }
    return this._eventIdsWithNoEvents;
	}

	removeEventsFromCalendar(eventIds: string[]) {
		let refs = {};
		for (let evenId of eventIds) {
			refs[evenId] = null;
		}
		return this.auth.getUser().pipe(
			first(),
			mergeMap(user => from(
				this.db.object('calendar/users/' + user.uid + '/assos').update(refs)
			))
		).toPromise();
	}
}
