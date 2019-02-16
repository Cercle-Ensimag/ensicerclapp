import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {DicoService} from '../../language/dico.service';
import {JobAdsService} from '../jobads.service';

@Component({
	selector: 'app-jobads-home',
	templateUrl: './jobads-home.component.html',
	styleUrls: ['./jobads-home.component.css']
})
export class JobAdsHomeComponent implements OnInit {

	constructor(
		public jobads: JobAdsService,
		public d: DicoService,
		public location: Location
	) { }

	ngOnInit() { }
}
