
import {map} from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {FormControl, Validators} from '@angular/forms';

import {DeviceSizeService} from '../../providers/device-size.service';
import {AuthService} from '../../auth/auth-service/auth.service';
import {VoteService} from '../vote-service/vote.service';
import {ToolsService} from '../../providers/tools.service';
import {DicoService} from '../../language/dico.service';
import {Observable} from 'rxjs';

export class VoteUser {
	emailId: string;
	voted: boolean;
}
@Component({
	selector: 'app-vote-users',
	templateUrl: './vote-users.component.html',
	styleUrls: ['./vote-users.component.css']
})
export class VoteUsersComponent implements OnInit {
	private emailCtrl = new FormControl('', [this.auth.emailDomainValidator, Validators.email]);
	private id: string;

	constructor(
		private route: ActivatedRoute,
		private vote: VoteService,
		private auth: AuthService,

		public location: Location,
		public media: DeviceSizeService,
		public tools: ToolsService,
		public d: DicoService
	) {}

	ngOnInit() {
		this.id = this.route.snapshot.paramMap.get('id');
	}

	filteredUsers(): Observable<VoteUser[]> {
		let emailId = this.tools.getEmailIdFromEmail(this.emailCtrl.value);
		return this.vote.getUsers(this.id).pipe(
			map(users => users.filter(
				user => user.emailId.includes(emailId)
			))
		);
	}

}
