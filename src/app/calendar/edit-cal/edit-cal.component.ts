import {Component, OnDestroy, OnInit, Inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {Tools} from '../../providers/tools.service';
import {CalEvent, CalService, PERSOS} from '../cal-service/cal.service';
import {DicoService} from '../../language/dico.service';
import {MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';

import {of, Subject, combineLatest} from 'rxjs';
import {first, flatMap, map, takeUntil, tap} from 'rxjs/operators';

@Component({
	selector: 'app-edit-cal',
	templateUrl: './edit-cal.component.html',
	styleUrls: ['./edit-cal.component.css']
})
export class EditCalComponent implements OnInit, OnDestroy {
	private unsubscribe: Subject<void> = new Subject();
	private key: string;

	public formGroup: FormGroup;
	public id: string;

	constructor(
		@Inject(MAT_DIALOG_DATA) private data: {day: Date, id: string},
		private cal: CalService,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private snackBar: MatSnackBar,

		public location: Location,
		public d: DicoService
	) {}

	ngOnInit() {
		this.id = this.data.id;
		this.initFormGroup();
	}

	getCipheredField(cipher: boolean, field: string): string {
		if (!cipher) {
			return field;
		}
		if (this.key) {
			return Tools.decipher(field, this.key) || "********";
		} else {
			return "********";
		}
	}

	getTitle(event: CalEvent): string {
		return this.getCipheredField(event.cipher, event.title);
	}

	getLocation(event: CalEvent): string {
		return this.getCipheredField(event.cipher, event.location);

	}

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	initFormGroup() {
		combineLatest(
			this.cal.getEvent(this.id).pipe(
				takeUntil(this.unsubscribe),
				flatMap((event: CalEvent) => {
					if (event) return of(event);
					return this.cal.getEventId().pipe(
						first(),
						tap(id => this.id = id),
						map(id => new CalEvent(id, '', '', '', false, 1, '', PERSOS))
					);
				})
			),
			this.cal.getKey()
		).subscribe(([event, key]) => {
			this.key = key;
			this.formGroup = this.fb.group({
				title: [this.getTitle(event) || '', [Validators.required, Validators.maxLength(80)]],
				start: [this.data.day || new Date(event.start) || '', [Validators.required, Tools.dateValidator]],
				startTime: [Tools.getTimeFromDate(event.start), [Validators.required, Tools.timeValidator]],
				end: [this.data.day || new Date(event.end) || '', [Validators.required, Tools.dateValidator]],
				cipher: [event.cipher, [Validators.required]],
				occurences: [event.occurences || 1, [Validators.required, Validators.min(1), Validators.max(42)]],
				endTime: [Tools.getTimeFromDate(event.end), [Validators.required, Tools.timeValidator]],
				location: [this.getLocation(event) || '', [Validators.maxLength(300)]]
			});
			this.formGroup.get('start').valueChanges.pipe(
				takeUntil(this.unsubscribe)
			).subscribe(value => {
				this.formGroup.get('end').setValue(value);
			});
			this.formGroup.get('startTime').valueChanges.pipe(
				takeUntil(this.unsubscribe)
			).subscribe(value => {
				this.formGroup.get('endTime').setValue(value);
			});
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

	submit() {
		const key = Tools.loadKey();
		const cipher = this.formGroup.get('cipher').value
		if (!key && cipher) {
			this.snackBar.open(this.d.l.keyNotConfiguredError, this.d.l.okLabel, {duration: 2000});
			return;
		}
		const title = this.formGroup.get('title').value;
		const location = this.formGroup.get('location').value;
		this.cal.setEvent(
			new CalEvent(
				this.id,
				cipher ? Tools.cipher(title, key) : title,
				this.getStart(),
				this.getEnd(),
				cipher,
				this.formGroup.get('occurences').value,
				cipher ? Tools.cipher(location, key) : location,
				PERSOS
			)
		).then(() => {
			this.snackBar.open(this.d.l.changesApplied, this.d.l.okLabel, {duration: 2000});
			this.initFormGroup();
		});
	}
}
