import { Component, OnInit } from '@angular/core';
import { DicoService } from '../../language/dico.service';
import { NsigmaService } from '../nsigma.service';
import { Location } from '@angular/common';

@Component({
	selector: 'app-nsigma-home',
	templateUrl: './nsigma-home.component.html',
	styleUrls: ['./nsigma-home.component.css']
})
export class NsigmaHomeComponent implements OnInit {

	constructor(
		public nsigma: NsigmaService,
		public d: DicoService,
		public location: Location
	) { }

	ngOnInit() { }
}
