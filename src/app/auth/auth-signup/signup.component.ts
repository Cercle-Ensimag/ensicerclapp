import {takeUntil} from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';

import {AuthService} from '../auth-service/auth.service';
import {DicoService} from '../../language/dico.service';
import {Location} from '@angular/common';
import {Subject} from 'rxjs';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit {
	private unsubscribe: Subject<void> = new Subject();

	public formGroup: FormGroup;
	public hidePassword: boolean = true;

	constructor(
		private fb: FormBuilder,

		public auth: AuthService,
		public location: Location,
		public d: DicoService,
		private snackBar: MatSnackBar
	) {
		this.formGroup = this.fb.group({
			firstName: ['', [Validators.required]],
			lastName: ['', [Validators.required]],
			email: ['', [
				Validators.required,
				Validators.email,
				this.auth.emailDomainValidator
			]],
			password: ['', [
				Validators.required,
				Validators.minLength(6)
			]]
		});
	}

	ngOnInit() {
		this.auth.resetError();
		this.auth.isLogged().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(is => {
			if (is) this.auth.goToHome();
		});
	}

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	submit() {
		if(this.formGroup.valid){
			this.auth.createAccount(
				this.formGroup.get('email').value,
				this.formGroup.get('password').value,
				this.formGroup.get('firstName').value,
				this.formGroup.get('lastName').value
			).then(
				([user, emailp, authProfile, dbProfile]) => {
					emailp.then(
						() => { this.auth.goToEmailVerif(); }
					).catch(reason => {
						this.snackBar.open(reason, this.d.l.ok, {duration: 2000});
						console.log(reason);
					});
					authProfile.catch(reason => {
						this.snackBar.open(reason, this.d.l.ok, {duration: 2000});
						console.log(reason);
					});
					dbProfile.catch(reason => {
						this.snackBar.open(reason, this.d.l.ok, {duration: 2000});
						console.log(reason);
					});
				}
			).catch(reason => {
				this.snackBar.open(reason, this.d.l.ok, {duration: 2000});
				this.auth.onAuthError(reason);
			});
		}
	}
}
