import { Component, OnInit } from '@angular/core';
import { NsigmaService } from '../nsigma.service';
import { DicoService } from '../../language/dico.service';
import { Tools } from '../../providers/tools.service';
import { Location } from '@angular/common';

@Component({
	selector: 'app-nsigma-admin',
	templateUrl: './nsigma-admin.component.html',
	styleUrls: ['./nsigma-admin.component.css']
})
export class NsigmaAdminComponent implements OnInit {

	constructor(
		public nsigma: NsigmaService,
		public d: DicoService,
		public location: Location
	) {}

	ngOnInit() { }

}
