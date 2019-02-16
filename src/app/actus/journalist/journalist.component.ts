import {Component, OnInit} from '@angular/core';
import {ActusService} from '../actus-service/actus.service';
import {Location} from '@angular/common';

@Component({
	selector: 'app-journalist',
	templateUrl: './journalist.component.html',
	styleUrls: ['./journalist.component.css']
})
export class JournalistComponent implements OnInit {

	constructor(
		public actus: ActusService,
		public location: Location
	) {}

	ngOnInit () { }
}
