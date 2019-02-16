import {Component, OnInit} from '@angular/core';
import {EventsService} from '../events-service/events.service';
import {DicoService} from '../../language/dico.service';
import {Location} from '@angular/common';

@Component({
	selector: 'app-com-resp',
	templateUrl: './com-resp.component.html',
	styleUrls: ['./com-resp.component.css']
})
export class ComRespComponent implements OnInit {

	constructor(
		public location: Location,
		public events: EventsService,
		public d: DicoService
	) { }

	ngOnInit () { }
}
