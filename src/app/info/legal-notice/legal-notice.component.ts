import { Component, OnInit } from '@angular/core';
import { DicoService } from '../../language/dico.service'


@Component({
	selector: 'app-legal-notice',
	templateUrl: './legal-notice.component.html',
	styleUrls: ['../info.component.css']
})
export class LegalNoticeComponent implements OnInit {

	constructor(
		public d: DicoService
	) { }

	ngOnInit() { }
}
