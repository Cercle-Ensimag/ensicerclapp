import {Component, OnInit} from '@angular/core';

import {EventsService} from '../events-service/events.service';
import {DicoService} from '../../language/dico.service';
import {Tools} from '../../providers/tools.service';
import {Location} from '@angular/common';


@Component({
	selector: 'app-events-home',
	templateUrl: './events-home.component.html',
	styleUrls: ['./events-home.component.css']
})
export class EventsHomeComponent implements OnInit {

	constructor(
		public events: EventsService,
		public d: DicoService,
		public location: Location
	) { }

	ngOnInit() { }
}
