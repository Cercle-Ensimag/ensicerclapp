import {Component, OnInit} from '@angular/core';

import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

import {DicoService} from '../../language/dico.service';
import {NsigmaService} from '../nsigma.service';

@Component({
	selector: 'app-nsigma-jobad',
	templateUrl: './nsigma-jobad.component.html',
	styleUrls: ['./nsigma-jobad.component.css']
})
export class NsigmaJobAdComponent implements OnInit {
	public id: string;

	constructor(
		private route: ActivatedRoute,

		public nsigma: NsigmaService,
		public d: DicoService,
		public location: Location
	) { }

	ngOnInit() {
		this.id = this.route.snapshot.paramMap.get('id');
	}
}
