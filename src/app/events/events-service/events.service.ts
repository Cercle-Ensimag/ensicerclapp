import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

import {ToolsService} from '../../providers/tools.service';
import {AuthService} from '../../auth/auth-service/auth.service';
import {CalEvent} from '../../calendar/cal-service/cal.service';

import {combineLatest, from, Observable} from 'rxjs';
import {first, map, tap, mergeMap, shareReplay} from 'rxjs/operators';

export class Event {
  id: string;
  title: string;
  description: string;
  image: string;
  start: number;
  end: number;
  location: string;
  price: string;
	groupId1: string;
	groupId2: string;
	groupId3: string;
}

export class ComResp {
  emailId: string;
	groupId1: string;
	groupId2: string;
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
	private _groups: Observable<Group[]>;

  constructor(
    private db: AngularFireDatabase,
    private tools: ToolsService,
    private auth: AuthService
  ) {
  }

  getEvents(): Observable<Event[]> {
    if (!this._events) {
      this._events = this.tools.enableCache(
        this.db.list<Event>(
					'events/events',
					ref => ref.orderByChild('start')
				).valueChanges().pipe(
					map((events: Event[]) => events.reverse())
				),
				'_events'
			)
      .pipe(
        shareReplay(1)
			);
    }
    return this._events;
  }

  getActiveEvents(): Observable<Event[]> {
    if (!this._activeEvents) {
      this._activeEvents =  this.tools.enableCache(
				this.db.list<Event>(
					'events/events',
					ref => ref.orderByChild('end').startAt(Date.now(), "end")
				).valueChanges(),
				'_activeEvents'
			).pipe(
        shareReplay(1)
			);
    }
    return this._activeEvents;
  }

  getEventsImRespoOf(): Observable<Event[]> {
    return combineLatest(
      this.getEvents(),
      this.auth.getComRespIds()
    ).pipe(
      map(([events, comRespIds]: [Event[], string[]]) => {
				return events.filter(event => this.imRespoOf(event, comRespIds))
			})
		).pipe(shareReplay(1));
  }

	imRespoOf(event: Event, comRespIds: string[]): boolean {
		for (let eventGroupId of this.getEventGroupIds(event)) {
			if (comRespIds.includes(eventGroupId)) {
				return true;
			}
		}
		return false;
	}

  getEvent(eventId: string): Observable<Event> {
    if (!this._event[eventId]) {
      this._event[eventId] = this.tools.enableCache(
        this.db
          .object<Event>('events/events/' + eventId)
          .valueChanges(), `_event${eventId}`)
          .pipe(shareReplay(1));
    }
    return this._event[eventId];
  }

	getEventGroupIds(event: Event): string[] {
		let ids = [];
		for (let i of [1, 2, 3]) {
			if (event['groupId' + i]) {
				ids.push(event['groupId' + i]);
			}
		}
		return ids;
	}

  getEventId(): string {
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

	setGroup(group: Group) {
    return this.db.object<Group>('events/com-resps/groups/' + group.groupId).set(group);
	}

	removeGroup(groupId: string) {
		return this.db.object<Group>('events/com-resps/groups/' + groupId).remove();
	}

  getGroupId(): string {
    return this.db.list<Event>('events/com-resps/groups').push(null).key;
  }

	getGroups(): Observable<Group[]> {
		if (!this._groups) {
			this._groups = this.tools.enableCache(
				this.db.list<Group>('events/com-resps/groups').valueChanges(),
				'_events-groups'
			).pipe(shareReplay(1));
		}
		return this._groups;
	}

	getGroupName(groupId: string): Observable<string> {
		return this.getGroups().pipe(map(groups => groups.find(group => group.groupId === groupId).displayName));
	}

	getComRespGroups(): Observable<Group[]> {
		return combineLatest(
			this.auth.getComRespIds(),
			this.getGroups()
		).pipe(
			map(([comRespIds, groups]: [string[], Group[]]) => {
				return groups.filter(
					group => comRespIds.includes(group.groupId) || this.auth.isAdminOf('events')
				);
			})
		);
	}

	getUserGroupIds(user: ComResp): string[] {
		let ids = [];
		for (let i of [1, 2]) {
			if (user['groupId' + i]) {
				ids.push(user['groupId' + i]);
			}
		}
		return ids;
	}

	addComResp(email: string, groupId1: string, groupId2: string) {
		let emailId = this.tools.getEmailIdFromEmail(email);
		return this.db.object<ComResp>('events/com-resps/resps/' + emailId).set({
			emailId: emailId,
			groupId1: groupId1,
			groupId2: groupId2
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
