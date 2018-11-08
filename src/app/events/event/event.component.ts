import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

import {DicoService} from '../../language/dico.service';
import {EventsService, Event} from '../events-service/events.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  public id: string;

  constructor(
    private route: ActivatedRoute,

    public events: EventsService,
    public location: Location,
    public d: DicoService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  isInCalendar(): Observable<boolean> {
    return this.events.getEventInCalendar(this.id);
  }

	getGroupName(groupId: string): Observable<string> {
		return this.events.getGroupName(groupId);
	}

	getEventGroupIds(event: Event): string[] {
		return this.events.getEventGroupIds(event);
	}
}
