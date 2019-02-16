import {Component, OnInit, OnDestroy} from '@angular/core';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';

import {DeviceSizeService} from '../../providers/device-size.service';
import {EventsService, Event, Group, ComResp} from '../events-service/events.service';
import {AuthService} from '../../auth/auth-service/auth.service';
import {ListService} from '../../providers/list.service';
import {Tools} from '../../providers/tools.service';
import {DicoService} from '../../language/dico.service';
import {Subject, Observable} from 'rxjs';
import {first, map, takeUntil} from 'rxjs/operators';

@Component({
	selector: 'app-event-admin',
	templateUrl: './event-admin.component.html',
	styleUrls: ['./event-admin.component.css']
})
export class EventAdminComponent implements OnInit, OnDestroy {
	private unsubscribe: Subject<void> = new Subject();
	private hasChanged: boolean = false;
	private eventsObs: Observable<Event[]>;
	public groups: Group[];
	public eventsFormGroup: FormGroup;
	public respsFormGroup: FormGroup;
	public groupCtrl = new FormControl('', [Validators.minLength(2), Validators.maxLength(30)]);

	constructor(
		private auth: AuthService,
		private snackBar: MatSnackBar,
		private list: ListService,
		private fb: FormBuilder,

		public location: Location,
		public events: EventsService,
		public media: DeviceSizeService,
		public d: DicoService
	) {	}

	ngOnInit () {
		this.respsFormGroup = this.fb.group({
			email: ['', [this.auth.emailDomainValidator, Validators.email]],
			asso1: [null, [Validators.required, Validators.maxLength(30)]],
			asso2: [null, [Validators.maxLength(30)]]
		});
		this.events.getGroups().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(groups => {
			this.groups = groups;
			let filters = {};
			groups.forEach(group => {
				filters[group.groupId] = [true,	[]]
			});
			this.eventsFormGroup = this.fb.group(filters);
			this.eventsFormGroup.valueChanges.subscribe(
				() => this.hasChanged = true
			);
		});
	}

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	getEvents(): Observable<Event[]> {
		if (!this.eventsObs || this.hasChanged) {
			this.eventsObs = this.events.getEvents().pipe(
				map(events => this.filteredEvents(events))
			);
			this.hasChanged = false;
		}
		return this.eventsObs;
	}

	filteredEvents(events: Event[]): Event[] {
		return events.filter(
			event => {
				if (!this.eventsFormGroup) {
					return true;
				}
				for (let groupId of this.events.getEventGroupIds(event)) {
					if (this.eventsFormGroup.get(groupId).value) {
						return true;
					}
				}
				return false;
			}
		);
	}

	filteredUsers(): Observable<ComResp[]> {
		let emailId = Tools.getEmailIdFromEmail(this.respsFormGroup.get('email').value);
		return this.events.getComResps().pipe(
			map(users => users.filter(
				user => user.emailId.includes(emailId)
			))
		);
	}

	addComResp() {
		let email = this.respsFormGroup.get('email').value;
		let emailId = Tools.getEmailIdFromEmail(email);
		this.list.isInList(email).pipe(
			first()
		).subscribe(inList => {
			if (!inList) {
				let name = Tools.getNameFromEmailId(emailId);
				this.snackBar.open(this.d.format(this.d.l.notOnTheList, name), this.d.l.okLabel, {duration: 2000});
			} else {
				this.events.addComResp(
					email,
					this.respsFormGroup.get('asso1').value,
					this.respsFormGroup.get('asso2').value
				);
				this.respsFormGroup.get('email').setValue('');
				this.respsFormGroup.get('asso1').reset();
				this.respsFormGroup.get('asso2').reset();
			}
		});
	}

	getComRespGroups(): Observable<Group[]> {
		return this.events.getComRespGroups();
	}

	filteredGroups(): Observable<Group[]> {
		return this.events.getGroups().pipe(
			map(groups => groups.filter(
				group => group.displayName.includes(this.groupCtrl.value)
			))
		);
	}

	addGroup() {
		this.events.setGroup({
			groupId: this.events.getGroupId(),
			displayName: this.groupCtrl.value
		}).then(() => this.groupCtrl.setValue(''));
	}

	removeGroup(groupId: string) {
		this.events.removeGroup(groupId);
	}

	getUserGroupIds(user: ComResp): string[] {
		return this.events.getUserGroupIds(user);
	}

	getGroupName(groupId: string): Observable<string> {
		return this.events.getGroupName(groupId);
	}

	getUserName(user: ComResp): string {
		return Tools.getNameFromEmailId(user.emailId);
	}

}
