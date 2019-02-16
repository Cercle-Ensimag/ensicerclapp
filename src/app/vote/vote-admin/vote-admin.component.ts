
import {first, map} from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

import {DeviceSizeService} from '../../providers/device-size.service';
import {VoteService} from '../vote-service/vote.service';
import {AuthService} from '../../auth/auth-service/auth.service';
import {ListService} from '../../providers/list.service';
import {Tools} from '../../providers/tools.service';
import {DicoService} from '../../language/dico.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';
import {Location} from '@angular/common';

export class Assessor {
	emailId: string;
}

@Component({
	selector: 'app-vote-admin',
	templateUrl: './vote-admin.component.html',
	styleUrls: ['./vote-admin.component.css']
})
export class VoteAdminComponent implements OnInit {
	public emailCtrl = new FormControl('', [this.auth.emailDomainValidator, Validators.email]);
	public selectedTab = 0;

	constructor(
		private auth: AuthService,
		private list: ListService,
		private dialog: MatDialog,
		private snackBar: MatSnackBar,

		public d: DicoService,
		public vote: VoteService,
		public media: DeviceSizeService,
		public location: Location
	) { }

	ngOnInit () { }

	filteredUsers(): Observable<Assessor[]> {
		let emailId = Tools.getEmailIdFromEmail(this.emailCtrl.value);
		return this.vote.getAssessors().pipe(
			map(users => users.filter(
				user => user.emailId.includes(emailId)
			))
		);
	}

	addAssessor() {
		const emailId = Tools.getEmailIdFromEmail(this.emailCtrl.value);
		this.list.isInList(this.emailCtrl.value).pipe(
			first()
		).subscribe(inList => {
			if (!inList) {
				let name = Tools.getNameFromEmailId(emailId);
				this.snackBar.open(this.d.format(this.d.l.notOnTheList, name), this.d.l.okLabel, {duration: 2000});
			} else {
				this.vote.addAssessor(this.emailCtrl.value);
				this.emailCtrl.setValue('');
			}
		});
	}

	tabChanged(event) {
		this.selectedTab = event.index;
	}

	getUserName(user: Assessor): string {
		return Tools.getNameFromEmailId(user.emailId);
	}
}
