import {Component} from '@angular/core';

import {DateService} from '../date.service';
import {DeviceSizeService} from '../../../../providers/device-size.service';
import {DicoService} from '../../../../language/dico.service';


@Component({
	selector: 'app-view2',
	templateUrl: './view2.html',
	styleUrls: ['./view2.css']
})
export class View2 {
	constructor(
		public date: DateService,
		public media: DeviceSizeService,
		public d: DicoService
	) { }
}
