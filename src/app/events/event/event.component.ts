import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

import {DicoService} from '../../language/dico.service';
import {EventsService, Event} from '../events-service/events.service';
import {CalService, Settings} from '../../calendar/cal-service/cal.service';
import {Observable, pipe} from 'rxjs';
import {map, tap, mergeMap, first} from 'rxjs/operators';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  public id: string;
	private _inCalendar: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
		private cal: CalService,

    public events: EventsService,
    public location: Location,
    public d: DicoService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  isInCalendar(): Observable<boolean> {
		if (!this._inCalendar) {
			this._inCalendar = this.cal.getSettings().pipe(
				mergeMap(settings => {
					if (!settings || settings.assosEventsByDefault) {
						return this.events.getEventIDontWant(this.id);
					} else {
						return this.events.getEventIParticipate(this.id);
					}
				})
			);
		}
		return this._inCalendar;
  }

	removeEvent(eventId: string): Promise<any> {
		return this.cal.getSettings().pipe(
			first(),
			mergeMap(settings => {
				if (!settings || settings.assosEventsByDefault) {
					return this.events.addEventIDontWant(eventId);
				} else {
					return this.events.removeEventIParticipate(eventId);
				}
			})
		).toPromise();
	}

	addEvent(eventId: string): Promise<any> {
		return this.cal.getSettings().pipe(
			first(),
			mergeMap(settings => {
				if (!settings || settings.assosEventsByDefault) {
					return this.events.removeEventIDontWant(eventId);
				} else {
					return this.events.addEventIParticipate(eventId);
				}
			})
		).toPromise();
	}

	getGroupName(groupId: string): Observable<string> {
		return this.events.getGroupName(groupId);
	}

	getEventGroupIds(event: Event): string[] {
		return this.events.getEventGroupIds(event);
	}
}
