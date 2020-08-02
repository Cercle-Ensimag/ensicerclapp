import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth-service/auth.service';
import { Tools } from '../../providers/tools.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DicoService } from '../../language/dico.service';
import { NsigmaJobAd, NsigmaService } from '../nsigma.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
	selector: 'app-nsigma-edit',
	templateUrl: './nsigma-edit.component.html',
	styleUrls: ['./nsigma-edit.component.css']
})
export class NsigmaEditComponent implements OnInit, OnDestroy {
	private unsubscribe: Subject<void> = new Subject();
	private id: string;

	public formGroup: FormGroup;

	constructor(
		private auth: AuthService,
		private nsigma: NsigmaService,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private d: DicoService,
		private snackBar: MatSnackBar,

		public location: Location,
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
		return this.nsigma.getJobAd(this.id).pipe(
			takeUntil(this.unsubscribe)
		).subscribe((jobad) => {
			if (!jobad) {
				jobad = new NsigmaJobAd();
				jobad.type = 6;
				this.id = this.nsigma.getJobAdId();
			}
			this.formGroup = this.fb.group({
				title: [jobad.title || '', [Validators.required, Validators.maxLength(50)]],
				description: [jobad.description || '', [Validators.required, Validators.maxLength(5000)]],
				type: [jobad.type, [Validators.required, Validators.min(0), Validators.max(6)]],
				start: [new Date(jobad.start) || '', [Validators.required, Tools.dateValidator]],
				end: [new Date(jobad.end) || '', [Validators.required, Tools.dateValidator]],
				technologies: [jobad.technologies || '', [Validators.required, Validators.maxLength(100)]],
				difficulty: [jobad.difficulty || '', [Validators.required, Validators.maxLength(100)]],
				remuneration: [jobad.remuneration || 0, [Validators.required, Validators.min(0), Validators.max(500000)]],
				form: [jobad.form || '', [Validators.required, Tools.urlValidator, Validators.maxLength(100)]],
				done: [jobad.done || false, [Validators.required]]
			});
			this.formGroup.get('start').valueChanges.pipe(
				takeUntil(this.unsubscribe)
			).subscribe(value => this.formGroup.get('end').setValue(value));
		});
	}

	submit() {
		const jobad = {
			id: this.id,
			title: this.formGroup.get('title').value,
			description: this.formGroup.get('description').value,
			type: this.formGroup.get('type').value,
			start: this.formGroup.get('start').value.getTime(),
			end: this.formGroup.get('end').value.getTime(),
			technologies: this.formGroup.get('technologies').value,
			difficulty: this.formGroup.get('difficulty').value,
			remuneration: this.formGroup.get('remuneration').value,
			form: this.formGroup.get('form').value,
			done: this.formGroup.get('done').value
		};
		this.nsigma.setJobAd(jobad).then(() => {
			this.snackBar.open(this.d.l.changesApplied, this.d.l.ok, {duration: 2000});
			this.initFormGroup();
		});
	}
}
