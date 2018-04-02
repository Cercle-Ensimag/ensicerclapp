import { Component, OnInit, OnDestroy } from '@angular/core';

import { EventsService } from '../events-service/events.service';
import { DicoService } from '../../language/dico.service';

import { Event } from '../events-service/events.service';

@Component({
  selector: 'app-events-home',
  templateUrl: './events-home.component.html',
  styleUrls: ['./events-home.component.css']
})
export class EventsHomeComponent implements OnInit, OnDestroy {

  now: number;

  constructor(
    public events: EventsService,
    public d: DicoService
  ) { }

  ngOnInit() {
    this.events.start();
  }

  ngOnDestroy() {
    this.events.stop();
  }

  isNotPassed(event: Event) {
    return event.end > Date.now();
  }

  isNow(event: Event) {
    return event.start < Date.now() && this.isNotPassed(event);
  }

  color(event: Event) {
      if (this.isNow(event)) {
          return "primary";
      } else {
          return "";
      }
  }

}
