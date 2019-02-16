import {Component, OnInit} from '@angular/core';

import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

import {DicoService} from '../../language/dico.service';
import {JobAdsService} from '../jobads.service';

@Component({
	selector: 'app-jobads-jobad',
	templateUrl: './jobads-jobad.component.html',
	styleUrls: ['./jobads-jobad.component.css']
})
export class JobAdsJobAdComponent implements OnInit {
	public id: string;

	constructor(
		private route: ActivatedRoute,

		public jobads: JobAdsService,
		public d: DicoService,
		public location: Location
	) { }

	ngOnInit() {
		this.id = this.route.snapshot.paramMap.get('id');
	}
}
