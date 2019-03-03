import {Component} from '@angular/core';

import {DateService} from '../date.service';
import {DeviceSizeService} from '../../../../providers/device-size.service';
import {DicoService} from '../../../../language/dico.service';


@Component({
	selector: 'app-view1',
	templateUrl: './view1.html',
	styleUrls: ['./view1.css']
})
export class View1 {
	constructor(
		public date: DateService,
		public media: DeviceSizeService,
		public d: DicoService
	) { }

	get selectedDay(): Date {
		return this.date.getSelectedDay();
	}

	set selectedDay(day: Date) {
		this.date.setSelectedDay(day);
	}
}
