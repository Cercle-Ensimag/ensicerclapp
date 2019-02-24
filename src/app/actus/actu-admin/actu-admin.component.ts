import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';

import {DeviceSizeService} from '../../providers/device-size.service';
import {ActusService, Group, Journalist} from '../actus-service/actus.service';
import {AuthService} from '../../auth/auth-service/auth.service';
import {ListService} from '../../providers/list.service';
import {Tools} from '../../providers/tools.service';
import {DicoService} from '../../language/dico.service';
import {Observable} from 'rxjs';
import {first, map} from 'rxjs/operators';

@Component({
	selector: 'app-actu-admin',
	templateUrl: './actu-admin.component.html',
	styleUrls: ['./actu-admin.component.css']
})
export class ActuAdminComponent implements OnInit {
	public formGroup: FormGroup;
	public groupCtrl = new FormControl('', [Validators.minLength(2), Validators.maxLength(30)]);

	constructor(
		private auth: AuthService,
		private snackBar: MatSnackBar,
		private list: ListService,
		private fb: FormBuilder,

		public location: Location,
		public actus: ActusService,
		public media: DeviceSizeService,
		public d: DicoService
	) {}

	ngOnInit () {
		this.formGroup = this.fb.group({
			email: ['', [this.auth.emailDomainValidator, Validators.email]],
			asso1: [null, [Validators.required, Validators.maxLength(30)]],
			asso2: [null, [Validators.maxLength(30)]]
		});
	}

	filteredUsers(): Observable<Journalist[]> {
		let emailId = Tools.getEmailIdFromEmail(this.formGroup.get('email').value);
		return this.actus.getJournalists().pipe(
			map(journalists => journalists.filter(
				user => user.emailId.includes(emailId)
			)));
	}

	addJournalist() {
		let email = this.formGroup.get('email').value;
		let emailId = Tools.getEmailIdFromEmail(email);
		this.list.isInList(email)
			.pipe(first())
			.subscribe(inList => {
				if (!inList) {
					let name = Tools.getNameFromEmailId(emailId);
					this.snackBar.open(this.d.format(this.d.l.notOnTheList, name), this.d.l.ok, {duration: 2000});
				} else {
					this.actus.addJournalist(
						email,
						this.formGroup.get('asso1').value,
						this.formGroup.get('asso2').value
					);
					this.formGroup.get('email').setValue('');
					this.formGroup.get('asso1').reset();
					this.formGroup.get('asso2').reset();
				}
			});
	}

	getJournalistGroups(): Observable<Group[]> {
		return this.actus.getJournalistGroups();
	}

	filteredGroups(): Observable<Group[]> {
		return this.actus.getGroups().pipe(
			map(groups => groups.filter(
				group => group.displayName.includes(this.groupCtrl.value)
			))
		);
	}

	addGroup() {
		this.actus.setGroup({
			groupId: this.actus.getGroupId(),
			displayName: this.groupCtrl.value
		}).then(() => this.groupCtrl.setValue(''));
	}

	removeGroup(groupId: string) {
		this.actus.removeGroup(groupId);
	}

	getUserGroupIds(user: Journalist): string[] {
		return this.actus.getUserGroupIds(user);
	}

	getGroupName(groupId: string): Observable<string> {
		return this.actus.getGroupName(groupId);
	}

	getUserName(user: Journalist): string {
		return Tools.getNameFromEmailId(user.emailId);
	}

}
