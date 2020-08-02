import { Component, OnInit } from '@angular/core';
import { DicoService } from '../language/dico.service';
import { AuthService } from '../auth/auth-service/auth.service';
import { Location } from '@angular/common';

@Component({
	selector: 'app-info',
	templateUrl: './info.component.html',
	styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

	constructor(
		public d: DicoService,
		public location: Location,
		public auth: AuthService
	) { }

	ngOnInit() { }

}
