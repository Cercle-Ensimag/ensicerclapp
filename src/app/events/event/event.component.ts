import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { DicoService } from '../../language/dico.service';
import { EventsService } from '../events-service/events.service';

import { Event } from '../events-home/events-home.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  event: Event;
  eventWatcher: any;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public events: EventsService,
    public d: DicoService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.eventWatcher = this.watchEvent(id);
  }

  watchEvent(eventId: string) {
    return this.events.getEvent(eventId).subscribe((event) => {
      this.event = event;
    });
  }

  back() {
    this.location.back();
  }
}
