import { Component, OnInit, OnDestroy } from '@angular/core';

import { EventsService } from '../events-service/events.service';
import { DicoService } from '../../language/dico.service';
import { ToolsService } from '../../providers/tools.service'

import { Event } from '../events-service/events.service';
import { Location } from '@angular/common';


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
    public location: Location,
		private tools: ToolsService
  ) { }

  ngOnInit() {
    this.events.start();
  }

  ngOnDestroy() {
    this.events.stop();
  }
}
