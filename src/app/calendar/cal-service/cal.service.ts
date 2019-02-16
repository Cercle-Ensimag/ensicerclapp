import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {AngularFireDatabase} from '@angular/fire/database';
import {FormControl} from '@angular/forms';

import {DicoService} from '../../language/dico.service';
import {AuthService} from '../../auth/auth-service/auth.service';
import {EventsService} from '../../events/events-service/events.service';

import * as parseICS from 'ics-parser';
import * as fileSaver from 'file-saver';

import {environment} from '../../../environments/environment';

import {combineLatest, merge, of, from, EMPTY, Observable, Subject} from 'rxjs';
import {first, map, catchError, mergeMap, shareReplay, tap, skip} from 'rxjs/operators';
import {Tools} from '../../providers/tools.service';

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
	cipher: boolean;
	occurences: number;
	location: string;
	type: string;

	constructor(
		id: string, name: string, start: any, end: any,
		cipher: boolean, occurences: number,
		loc: string, type: string
	) {
		this.id = id;
		this.title = name;
		this.start = (new Date(start)).getTime();
		this.end = (new Date(end)).getTime();
		this.cipher = cipher
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

	getCipheredField(field: string, key: string): string {
		if (!this.cipher) {
			return field;
		}
		if (key) {
			return Tools.decipher(field, key) || "********";
		} else {
			return "********";
		}
	}

	getTitle(key: string): string {
		return this.getCipheredField(this.title, key);
	}

	getLocation(key: string): string {
		return this.getCipheredField(this.location, key);
	}
}

export class Settings {
	resources: string;
	icsDownload: boolean;
	assosEventsByDefault: boolean;
	keyHash: string;

	constructor(
		resources: string, icsDownload: boolean,
		assosEventsByDefault: boolean,
		keyHash: string
	) {
		this.resources = resources;
		this.icsDownload = icsDownload;
		this.assosEventsByDefault = assosEventsByDefault;
		this.keyHash = keyHash;
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
	private _assosEventsIParticipate: Observable<CalEvent[]>;
	private _assosEventsIDontWant: Observable<CalEvent[]>;
	private _assosEventsISeemToWant: Observable<CalEvent[]>;
	private _myEvents: Observable<CalEvent[]>;
	private _calFromAde: Observable<string>;
	private _myEventsForDay: { [$dayString: string]: Observable<CalEvent[]> } = {};
	private _settings: Observable<Settings>;
	private _event: { [$eventId: string]: Observable<CalEvent> } = {};
	private _eventIdsWithNoEvents: Observable<string[]>;
	private _keyObs: Observable<string>;
	private _errorNotifier: Subject<string> = new Subject<string>();
	private _ADErefresh: Subject<Settings> = new Subject<Settings>();
	private _keyRefresh: Subject<Settings> = new Subject<Settings>();
	private _ADEError: boolean = false;
	private _lastADEUpdate: number;

	constructor(
		private auth: AuthService,
		private db: AngularFireDatabase,
		private events: EventsService,
		private http: HttpClient,

		public d: DicoService,
		public datepipe: DatePipe
	) { }

	getErrorNotifier(): Subject<string> {
		return this._errorNotifier;
	}

	needRefreshADE(): boolean {
		if (this._lastADEUpdate) {
			if (Date.now() > this._lastADEUpdate + 6 * 60 * 60 * 1000) {
				return true;
			}
		}
		return this._ADEError;
	}

	setADEError(error) {
		if (error) {
			this._errorNotifier.next("ADE update failed");
			this._ADEError = true;
		} else {
			this._ADEError = false;
			this._lastADEUpdate = Date.now();
		}
	}

	refreshADE() {
		this.getSettings().pipe(
			first()
		).toPromise().then(
			settings => this._ADErefresh.next(settings)
		)
	}

	getCoursesEvents(): Observable<CalEvent[]> {
		if (!this._coursesEvents) {
			this._coursesEvents = Tools.enableCache(
				merge(
					this.getSettings(),
					this._ADErefresh
				).pipe(
					mergeMap((settings: Settings) => {
						if (!settings || !settings.resources) {
							return of([]);
						}
						return this.getCalFromAde(settings.resources).pipe(
							catchError(
								err => {
									this.setADEError(err);
									return EMPTY;
								}
							),
							map(
								cal => {
									this.setADEError(null);
									return parseICS(cal)
								}
							)
						)
					})
				),
				"cal-ADEevents"
			).pipe(
				map(ICSevents => ICSevents.map((event: ICSEvent) => new CalEvent(
					'',
					event.name.replace(/\\,/g, ', '),
					event.startDate,
					event.endDate,
					false,
					1,
					event.location.replace(/\\,/g, ', '),
					COURSE
				))),
				shareReplay(1)
			);
		}
		return this._coursesEvents;
	}

	getAssosEvents(): Observable<CalEvent[]> {
		if (!this._assosEvents) {
			this._assosEvents = this.events.getActiveEvents().pipe(
				map(events => events.map(event => new CalEvent(
					event.id, event.title, event.start, event.end, false, 1, event.location, ASSOS
				))),
				shareReplay(1)
			);
		}
		return this._assosEvents;
	}

	getAssosEventsIParticipate(): Observable<CalEvent[]> {
		if (!this._assosEventsIParticipate) {
			this._assosEventsIParticipate = combineLatest(
				this.events.getAssosEventsIdsIParticipate(),
				this.getAssosEvents()
			).pipe(
				map(
					([ids, events]: [string[], CalEvent[]]): CalEvent[] =>
					events.filter((event: CalEvent): boolean => ids.includes(event.id))
				),
				shareReplay(1)
			);
		}
		return this._assosEventsIParticipate;
	}

	getAssosEventsIDontWant(): Observable<CalEvent[]> {
		if (!this._assosEventsIDontWant) {
			this._assosEventsIDontWant = combineLatest(
				this.events.getAssosEventsIdsIDontWant(),
				this.getAssosEvents()
			).pipe(
				map(
					([ids, events]: [string[], CalEvent[]]): CalEvent[] =>
					events.filter((event: CalEvent): boolean => ids.includes(event.id))
				),
				shareReplay(1)
			);
		}
		return this._assosEventsIDontWant;
	}

	getAssosEventsISeemToWant(): Observable<CalEvent[]> {
		if (!this._assosEventsISeemToWant) {
			this._assosEventsISeemToWant = combineLatest(
				this.events.getAssosEventsIdsIDontWant(),
				this.getAssosEvents()
			).pipe(
				map(
					([ids, events]: [string[], CalEvent[]]): CalEvent[] =>
					events.filter((event: CalEvent): boolean => !ids.includes(event.id))
				),
				shareReplay(1)
			);
		}
		return this._assosEventsISeemToWant;
	}

	getPersosEvents(): Observable<CalEvent[]> {
		if (!this._persosEvents) {
			this._persosEvents = Tools.enableCache(
				this.auth.getUser().pipe(
					mergeMap(
						user =>
						this.db.list<CalEvent>('calendar/users/'+user.uid+'/perso')
						.valueChanges()
					),
				),
				"cal-persoEvents"
			).pipe(
				// Duplicate events with multiple occurences
				map(events => {
					const toReturn = [];
					events.forEach(event => {
						for (let i = 0; i < event.occurences; i++){
							toReturn.push(new CalEvent(
								event.id,
								event.title,
								event.start + WEEK_LENGTH * i,
								event.end + WEEK_LENGTH * i,
								event.cipher || false,
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
			this._myEvents = combineLatest(
				this.getSettings().pipe(mergeMap(
					settings => !settings || settings.assosEventsByDefault ? this.getAssosEventsISeemToWant() : this.getAssosEventsIParticipate()
				)),
				this.getCoursesEvents(),
				this.getPersosEvents()
			).pipe(
				map(
					([asso, courses, perso]: [CalEvent[], CalEvent[], CalEvent[]]) =>
					asso.concat(courses).concat(perso).sort((event1, event2) => event1.start - event2.start)
				)
			).pipe(
				shareReplay(1)
			);
		}
		return this._myEvents;
	}

	getMyEventsForDay(date: Date): Observable<CalEvent[]>{
		const startOfDay = new Date(date.getTime()).setHours(0,0,0,0);
		const endOfDay = new Date(date.getTime()).setHours(23,59,59,999);
		const dayString = startOfDay.toLocaleString().split(' ')[0];

		if (!this._myEventsForDay[dayString]){
			this._myEventsForDay[dayString] = this.getMyEvents().pipe(
				map((events: CalEvent[]) => events.filter(
					(event: CalEvent) => event.start <= endOfDay && event.end >= startOfDay)
				),
				shareReplay(1)
			);
		}
		return this._myEventsForDay[dayString]
	}

	getCalFromAde(resources: string): Observable<string> {
		if (!this._calFromAde){
			this._calFromAde = Tools.enableCache(
				this.http.get(
					this.getCoursesURL(resources), { responseType: 'text' }
				).pipe(
					mergeMap(ade => {
						if (ade) {
							return of(ade);
						} else {
							return EMPTY;
						}
					})
				),
				'cal-ICSFromADE',
				false
			).pipe(
				shareReplay(1)
			);
		}
		return this._calFromAde;
	}

	getSettings(): Observable<Settings> {
		if (!this._settings){
			this._settings = Tools.enableCache(
				this.auth.getLoggedUser().pipe(
					mergeMap(
						user => this.db.object<Settings>(
							'calendar/users/'+user.uid+'/settings'
						).valueChanges()
					)
				),
				'cal-settings'
			).pipe(
				shareReplay(1)
			);
			// TODO: return EMPTY if the same is produced before sharereplay
		}
		return this._settings;
	}

	setKey(key: string) {
		Tools.storeKey(key);

		this.getSettings().pipe(
			first()
		).toPromise().then(
			settings => this._keyRefresh.next(settings)
		);
	}

	getKey(): Observable<string> {
		if (!this._keyObs) {
			this._keyObs = merge(
				this.getSettings(),
				this._keyRefresh
			).pipe(
				map(settings => {
					const key = Tools.loadKey();
					if (key && settings) {
						const keyHash = Tools.generateKey(key)
						if (keyHash == settings.keyHash) {
							return key;
						}
					} else {
						return null;
					}

				}),
				shareReplay(1)
			);
		}
		return this._keyObs;
	}

	setSettings(settings: Settings) {
		return this.auth.getLoggedUser().pipe(
			first(),
			mergeMap(user => from(
				this.db.object<Settings>('calendar/users/'+user.uid+'/settings').set(settings)
			))
		).toPromise();
	}

	getEvent(eventId: string): Observable<CalEvent> {
		if (!this._event[eventId]){
			this._event[eventId] = this.getPersosEvents().pipe(
				map(events => events.find(event => event.id == eventId)),
				shareReplay(1)
			);
		}
		return this._event[eventId];
	}

	getEventId(): Observable<string> {
		return this.auth.getLoggedUser().pipe(
			first(),
			map(
				user => this.db.list<CalEvent>(
					'calendar/users/'+user.uid+'/perso/'
				).push(null).key
			)
		);
	}

	setEvent(event: CalEvent) {
		return this.auth.getLoggedUser().pipe(
			first(),
			mergeMap(
				user => from(
					this.db.object<CalEvent>(
						'calendar/users/'+user.uid+'/perso/'+event.id
					).set(event)
				)
			)
		).toPromise();
	}

	removeEvent(eventId: string) {
		return this.auth.getLoggedUser().pipe(
			first(),
			mergeMap(
				user => from(
					this.db.object<CalEvent>(
						'calendar/users/'+user.uid+'/perso/'+eventId
					).remove()
				)
			)
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

	getEventIdsIParticipateWithNoEvents(): Observable<string[]> {
		if (!this._eventIdsWithNoEvents) {
			this._eventIdsWithNoEvents = combineLatest(
				this.events.getAssosEventsIdsIParticipate(),
				this.getAssosEvents().pipe(
					map(events => events.map(event => event.id))
				)
			).pipe(
				map(
					([ids, eventIds]: [string[], string[]]): string[] =>
					ids.filter((id: string): boolean => !eventIds.includes(id))
				),
				shareReplay(1)
			);
		}
		return this._eventIdsWithNoEvents;
	}

	getEventIdsIDontWantWithNoEvents(): Observable<string[]> {
		if (!this._eventIdsWithNoEvents) {
			this._eventIdsWithNoEvents = combineLatest(
				this.events.getAssosEventsIdsIDontWant(),
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

	removeEventsIParticipate(eventIds: string[]) {
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

	removeEventsIDontWant(eventIds: string[]) {
		let refs = {};
		for (let evenId of eventIds) {
			refs[evenId] = null;
		}
		return this.auth.getUser().pipe(
			first(),
			mergeMap(user => from(
				this.db.object('calendar/users/' + user.uid + '/notAssos').update(refs)
			))
		).toPromise();
	}

	saveICS() {
		return this.getMyEvents().pipe(
			first(),
			map(events => events.filter(
				event => true
			)),
		).toPromise().then(events => {
			let text = "BEGIN:VCALENDAR\n"
			text += "VERSION:2.0\n"
			events.forEach(event => {
				text += "BEGIN:VEVENT\n"
				text += "DTSTART:" + this.computeICSDate(event.start) + "\n"
				text += "DTEND:" + this.computeICSDate(event.end) + "\n"
				text += "SUMMARY:" + event.title + "\n"
				text += "LOCATION:" + event.location + "\n"
				text += "END:VEVENT\n"
			});
			text += "END:VCALENDAR";
			let blob = new Blob([text], {type: "text/plain;charset=utf-8"});
			let date = this.datepipe.transform((new Date()).getTime(), 'yyyy-MM-dd', '', this.d.l.locale)
			fileSaver.saveAs(blob, "Events_" + date + ".ics");
		});
	}

	computeICSDate(date: number): string {
		return new Date(date).toISOString().replace(/-/g,'').replace(/:/g, '').replace(/\./, '');
	}
}
