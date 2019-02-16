import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Location} from '@angular/common';
import {User} from 'firebase/app';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';

import {Tools} from '../../providers/tools.service';
import {DeviceSizeService} from '../../providers/device-size.service';
import {AdminService} from '../admin-service/admin.service';
import {DicoService} from '../../language/dico.service';
import {ADMINS} from '../../auth/auth-service/auth.service';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.css']
})
export class AdminUsersComponent implements OnInit {
	public formGroup: FormGroup;
	public expandedUserUid: string = '';
	public adminsStrings: string[] = ADMINS;
	private usersObs: Observable<User[]>;
	private hasChanged: boolean = false;

	constructor(
		private fb: FormBuilder,

		public admin: AdminService,
		public d: DicoService,
		public media: DeviceSizeService,
		public location: Location
	) { }

	ngOnInit() {
		this.initSearchForm();
	}

	initSearchForm() {
		const controlsConfig = {
			search: ['', []]
		};
		this.adminsStrings.forEach((adminString: string) => { controlsConfig[adminString + 'Admins'] = [false, []] });

		this.formGroup = this.fb.group(controlsConfig);
		this.formGroup.valueChanges.subscribe(() => this.hasChanged = true);
	}

	getUsers(): Observable<User[]> {
		if (!this.usersObs || this.hasChanged) {
			this.usersObs = this.admin.getUsers().pipe(map(
				users => this.filteredUsers(users)
			));
			this.hasChanged = false;
		}
		return this.usersObs;
	}

	filteredUsers(users: User []): User[] {
		const emailId = this.formGroup.get('search').value.replace(' ', '|').toLowerCase();
		return users.filter(
			user => this.checkAgainstFilters(emailId, user)
		);
	}

	checkAgainstFilters(emailId, user) {
		const userData = user[user.uid];
		if (!userData) return false;

		const emailId2 = Tools.getEmailIdFromEmail(userData.admin.email);
		if (!emailId2.includes(emailId)) return false;

		for (const admin of this.adminsStrings){
			if (!this.isUserAdminOf(user, admin) && this.formGroup.get(admin + 'Admins').value) {
				return false;
			}
		}

		return true;
	}

	setExpanded(uid: string){
		this.expandedUserUid = uid;
	}

	setUserAdminOf(email: string, uid: string, of: string, checked: boolean) {
		this.admin.setUserAdminOf(email, uid, of, checked);
	}

	isUserAdminOf(user: any, of: string) {
		return user[user.uid]['admin'] ? user[user.uid]['admin'][of + '-admin'] === true : false;
	}

	getUserName(user: any): string {
		return Tools.getNameFromEmailId(
			Tools.getEmailIdFromEmail(user[user.uid].admin.email)
		).replace(/[0-9]/g, '');
	}
}
