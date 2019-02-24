
import {takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {JobAd, JobAdsService} from '../../jobads/jobads.service';
import {AuthService} from '../../auth/auth-service/auth.service';
import {Tools} from '../../providers/tools.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {DicoService} from '../../language/dico.service';
import {MatSnackBar} from '@angular/material';
import {Subject} from 'rxjs';



@Component({
	selector: 'app-jobads-edit',
	templateUrl: './jobads-edit.component.html',
	styleUrls: ['./jobads-edit.component.css']
})
export class JobAdsEditComponent implements OnInit, OnDestroy {
	private unsubscribe: Subject<void> = new Subject();

	public id: string;
	public formGroup: FormGroup;

	constructor(
		private auth: AuthService,
		private jobads: JobAdsService,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private snackBar: MatSnackBar,

		public location: Location,
		public d: DicoService
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
		this.jobads.getJobAd(this.id).pipe(
			takeUntil(this.unsubscribe)
		).subscribe((jobad) => {
			if (!jobad) {
				jobad = new JobAd();
				jobad.type = 2;
				this.id = this.jobads.getJobAdId();
			}
			this.formGroup = this.fb.group({
				title: [jobad.title || '', [Validators.required, Validators.maxLength(50)]],
				description: [jobad.description || '', [Validators.required, Validators.maxLength(5000)]],
				type: [jobad.type || 0, [Validators.required, Validators.min(0), Validators.max(2)]],
				start: [new Date(jobad.start) || '', [Validators.required, Tools.dateValidator]],
				length: [jobad.length || '', [Validators.required, Validators.maxLength(20)]],
				technologies: [jobad.technologies || '', [Validators.required, Validators.maxLength(100)]],
				contact: [jobad.contact || '', [Validators.required, Validators.maxLength(200)]],
				author: [jobad.author || '', [Validators.required, Validators.maxLength(30)]],
				done: [jobad.done || false, [Validators.required]]
			});
		});
	}

	submit() {
		const jobad = {
			id: this.id,
			title: this.formGroup.get('title').value,
			description: this.formGroup.get('description').value,
			type: this.formGroup.get('type').value,
			start: this.formGroup.get('start').value.getTime(),
			length: this.formGroup.get('length').value,
			technologies: this.formGroup.get('technologies').value,
			contact: this.formGroup.get('contact').value,
			author: this.formGroup.get('author').value,
			done: this.formGroup.get('done').value
		};
		this.jobads.setJobAd(jobad).then(() => {
			this.snackBar.open(this.d.l.changesApplied, this.d.l.ok, {duration: 2000});
			this.initFormGroup();
		});
	}
}
