import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Event, EventsService, Group } from '../events-service/events.service';

import { AuthService } from '../../auth/auth-service/auth.service';
import { Tools } from '../../providers/tools.service';
import { DicoService } from '../../language/dico.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Subject, Observable } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';



@Component({
	selector: 'app-edit-events',
	templateUrl: './edit-events.component.html',
	styleUrls: ['./edit-events.component.css']
})
export class EditEventsComponent implements OnInit, OnDestroy {
	private unsubscribe: Subject<void> = new Subject();

	public id: string;
	public formGroup: FormGroup;
	public mkdPreview: boolean = true;
	public imgPreview: boolean = true;

	constructor(
		private auth: AuthService,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private d: DicoService,
		private snackBar: MatSnackBar,

		public events: EventsService,
		public location: Location
	) {}

	ngOnInit() {
		this.id = this.route.snapshot.paramMap.get('id');
		this.initFormGroup();
	}

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	initFormGroup() {
		this.events.getEvent(this.id).pipe(
			takeUntil(this.unsubscribe)
		).subscribe((event) => {
			if (!event) {
				event = new Event();
				this.id = this.events.getEventId();
			}
			this.formGroup = this.fb.group({
				title: [event.title || '', [Validators.required, Validators.maxLength(50)]],
				description: [event.description || '', [Validators.maxLength(2000)]],
				image: [event.image || '', [Validators.maxLength(500)]],
				start: [new Date(event.start) || '', [Validators.required, Tools.dateValidator]],
				startTime: [Tools.getTimeFromDate(event.start), [Validators.required, Tools.timeValidator]],
				end: [new Date(event.end) || '', [Validators.required, Tools.dateValidator]],
				endTime: [Tools.getTimeFromDate(event.end), [Validators.required, Tools.timeValidator]],
				location: [event.location || '', [Validators.required, Validators.maxLength(300)]],
				price: [event.price || this.d.l.free, [Validators.required, Validators.maxLength(50)]],
				asso1: [event.groupId1 || null, [Validators.required, Validators.maxLength(30)]],
				asso2: [event.groupId2 || null, [Validators.maxLength(30)]],
				asso3: [event.groupId3 || null, [Validators.maxLength(30)]]
			});

			this.formGroup.get('start').valueChanges.pipe(
				takeUntil(this.unsubscribe)
			).subscribe(value => this.formGroup.get('end').setValue(value));
		});
	}

	getStart(): number {
		let time = this.formGroup.get('startTime').value;
		return Tools.setDayTime(this.formGroup.get('start').value.getTime(), time + ':00');
	}
	getEnd(): number {
		let time = this.formGroup.get('endTime').value;
		return Tools.setDayTime(this.formGroup.get('end').value.getTime(), time + ':00');
	}

	getComRespGroups(): Observable<Group[]> {
		return this.events.getComRespGroups();
	}

	getGroups(): Observable<Group[]> {
		return this.events.getGroups();
	}

	submit() {
		const event = {
			id: this.id,
			title: this.formGroup.get('title').value,
			description: this.formGroup.get('description').value,
			image: this.formGroup.get('image').value,
			start: this.getStart(),
			end: this.getEnd(),
			location: this.formGroup.get('location').value,
			price: this.formGroup.get('price').value,
			groupId1: this.formGroup.get('asso1').value || null,
			groupId2: this.formGroup.get('asso2').value || null,
			groupId3: this.formGroup.get('asso3').value || null
		};
		this.events.setEvent(event).then(() => {
			this.snackBar.open(this.d.l.changesApplied, this.d.l.ok, {duration: 2000});
			this.initFormGroup();
		}).catch(reason => {
			this.snackBar.open(reason, this.d.l.ok, {duration: 2000});
		});
	}

	back() {
		this.location.back();
	}

}
