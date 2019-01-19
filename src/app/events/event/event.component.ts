import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

import {DicoService} from '../../language/dico.service';
import {EventsService, Event} from '../events-service/events.service';
import {CalService, Settings} from '../../calendar/cal-service/cal.service';
import {Observable, pipe, combineLatest} from 'rxjs';
import {map, first} from 'rxjs/operators';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  public id: string;

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
    return combineLatest(
			this.cal.getSettings(),
			this.events.getEventIsMarked(this.id)
		).pipe(
			map(
				([settings, marked]: [Settings, boolean]) => {
					if (!settings || settings.assosEventsByDefault) {
						return !marked;
					} else {
						return marked;
					}
				}
			)
		);
  }

	removeEvent(eventId: string) {
		this.cal.getSettings().pipe(first()).toPromise().then(
			(settings: Settings) => {
				if (!settings || settings.assosEventsByDefault) {
					return this.events.addEventToCalendar(eventId);
				} else {
					return this.events.removeEventFromCalendar(eventId);
				}
			}
		);
	}

	addEvent(eventId: string) {
		this.cal.getSettings().pipe(first()).toPromise().then(
			(settings: Settings) => {
				if (!settings || settings.assosEventsByDefault) {
					return this.events.removeEventFromCalendar(eventId);
				} else {
					return this.events.addEventToCalendar(eventId);
				}
			}
		);
	}

	getGroupName(groupId: string): Observable<string> {
		return this.events.getGroupName(groupId);
	}

	getEventGroupIds(event: Event): string[] {
		return this.events.getEventGroupIds(event);
	}
}
