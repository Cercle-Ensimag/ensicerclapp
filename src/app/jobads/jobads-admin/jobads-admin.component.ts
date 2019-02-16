import {Component, OnInit} from '@angular/core';
import {JobAdsService} from '../jobads.service';
import {DicoService} from '../../language/dico.service';
import {Location} from '@angular/common';

@Component({
	selector: 'app-jobads-admin',
	templateUrl: './jobads-admin.component.html',
	styleUrls: ['./jobads-admin.component.css']
})
export class JobAdsAdminComponent implements OnInit {

	constructor(
		public jobads: JobAdsService,
		public d: DicoService,
		public location: Location
	) {}

	ngOnInit() { }
}
