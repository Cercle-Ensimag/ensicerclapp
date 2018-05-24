import { Component, OnInit, OnDestroy } from '@angular/core';

import { EventsService } from '../events-service/events.service';
import { DicoService } from '../../language/dico.service';
import { ToolsService } from '../../providers/tools.service'

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
    public d: DicoService,
		private tools: ToolsService
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

	singleDay(event: Event) {
		return this.tools.setDayTime(event.start, "00:00:00") == this.tools.setDayTime(event.end, "00:00:00")
	}

}
