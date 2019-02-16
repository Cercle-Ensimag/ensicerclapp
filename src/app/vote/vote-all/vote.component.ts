import { Component, OnInit} from '@angular/core';
import { VoteService } from '../vote-service/vote.service';
import { DicoService } from '../../language/dico.service';
import {Location} from '@angular/common';


@Component({
	selector: 'app-vote',
	templateUrl: './vote.component.html',
	styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {
	constructor(
		public vote: VoteService,
		public d: DicoService,
		public location: Location
	) { }

	ngOnInit() {}

}
