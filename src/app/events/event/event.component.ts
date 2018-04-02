import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { DicoService } from '../../language/dico.service';
import { EventsService } from '../events-service/events.service';

import { Event } from '../events-service/events.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit, OnDestroy {

  event: Event;
  isInCalendar: boolean;
  eventWatcher: any;
  calendarWatcher: any;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public events: EventsService,
    public d: DicoService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.eventWatcher = this.watchEvent(id);
    this.calendarWatcher = this.watchCalendar(id);
  }

  ngOnDestroy() {
    if (this.eventWatcher) {
      this.eventWatcher.unsubscribe();
    }
    if (this.calendarWatcher) {
      this.calendarWatcher.unsubscribe();
    }
  }

  watchEvent(eventId: string) {
    return this.events.getEvent(eventId).subscribe((event) => {
      this.event = event;
    });
  }

  watchCalendar(eventId: string) {
    return this.events.getEventInCalendar(eventId).subscribe((eventId) => {
      this.isInCalendar = eventId != null;
    })
  }

  back() {
    this.location.back();
  }
}
