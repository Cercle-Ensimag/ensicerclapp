import { Component, OnInit, OnDestroy } from '@angular/core';

import { EventsService } from '../events-service/events.service';
import { DicoService } from '../../language/dico.service';

export class Event {
  id: string;
  title: string;
  description: string;
  image: string;
  start: string;
  end: string;
  location: string;
  groupId: string;
}

@Component({
  selector: 'app-events-home',
  templateUrl: './events-home.component.html',
  styleUrls: ['./events-home.component.css']
})
export class EventsHomeComponent implements OnInit, OnDestroy {

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

}
