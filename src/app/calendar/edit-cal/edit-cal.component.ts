import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Tools } from '../../providers/tools.service';
import { CalEvent, CalService, PERSOS } from '../cal-service/cal.service';
import { DicoService } from '../../language/dico.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of, Subject, combineLatest } from 'rxjs';
import { first, flatMap, map, takeUntil, tap } from 'rxjs/operators';

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

	getTitle(event: CalEvent): string {
		return event.getTitle(this.key);
	}

	getLocation(event: CalEvent): string {
		return event.getLocation(this.key);
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
		const cipher = this.formGroup.get('cipher').value
		if (cipher) {
			this.cal.getKey().pipe(first()).toPromise().then(
				(key: string) => {
					if (!key) {
						this.snackBar.open(this.d.l.keyNotConfiguredError, this.d.l.ok, {duration: 2000});
						return;
					}
					this.saveEvent(key);
				}
			);
		} else {
			this.saveEvent();
		}
	}

	saveEvent(key: string = null) {
		this.cal.setEvent(
			new CalEvent(
				this.id,
				this.formGroup.get('title').value,
				this.getStart(),
				this.getEnd(),
				this.formGroup.get('cipher').value,
				this.formGroup.get('occurences').value,
				this.formGroup.get('location').value,
				PERSOS,
				key
			)
		).then(() => {
			this.snackBar.open(this.d.l.changesApplied, this.d.l.ok, {duration: 2000});
			this.initFormGroup();
		});
	}
}
