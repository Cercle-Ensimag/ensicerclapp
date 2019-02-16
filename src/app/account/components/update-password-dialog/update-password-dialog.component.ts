import {MAT_DIALOG_DATA} from '@angular/material';
import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DicoService} from '../../../language/dico.service';

@Component({
	selector: 'app-update-password-dialog',
	templateUrl: './update-password-dialog.component.html',
	styleUrls: ['./update-password-dialog.component.css']
})
export class UpdatePasswordDialogComponent implements OnInit {
	public formGroup: FormGroup = null;
	public hidePwd: boolean = true;
	public hidePwdConf: boolean = true;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		public d: DicoService
	) {}

	ngOnInit() {
		this.formGroup = this.fb.group({
			password: ['', [Validators.required, Validators.minLength(6)]],
			password_conf: ['', [Validators.required, Validators.minLength(6), this.passwordConfValidator.bind(this)]]
		});
	}

	passwordConfValidator (control: FormControl) {
		if (!this.formGroup || this.formGroup.get('password').value !== control.value) {
			return { error: true };
		}
		return null;
	}
}
