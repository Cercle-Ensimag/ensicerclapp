import {takeUntil} from 'rxjs/operators';
import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup} from '@angular/forms';

import {CalService, Settings} from '../cal-service/cal.service';
import {Tools} from '../../providers/tools.service';
import {DicoService} from '../../language/dico.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {LoginDialogComponent} from '../../shared-components/login-dialog/login-dialog.component';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';

import {Subject, combineLatest} from 'rxjs';

@Component({
	selector: 'app-cal-settings',
	templateUrl: './cal-settings.component.html',
	styleUrls: ['./cal-settings.component.css']
})


export class CalSettingsComponent implements OnInit, OnDestroy {
	private unsubscribe: Subject<void> = new Subject();
	private keyHash: string;
	private passwordOk: boolean;
	public formGroup: FormGroup;
	public hide: boolean = true;

	constructor(
		private fb: FormBuilder,
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
		private http: HttpClient,
		private router: Router,
		private ngZone: NgZone,

		public d: DicoService,
		public cal: CalService,
		public location: Location
	) { }

	ngOnInit() {
		combineLatest(
			this.cal.getSettings(),
			this.cal.getKey()
		).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(([settings, key]) => {
			if (!settings)
				settings = {
					resources: '',
					icsDownload: false,
					assosEventsByDefault: true,
					keyHash: null
				};
			this.formGroup = this.fb.group({
				resources: [settings.resources || '', [this.cal.resourcesValidator]],
				icsDownload: [settings.icsDownload || false, []],
				assosEventsByDefault: [settings.assosEventsByDefault || false, []],
				password: ['', []]
			});
			this.keyHash = settings.keyHash || null;
			this.passwordOk = Tools.generateKey(key) == this.keyHash;
		});
	}

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	submit() {
		const password = this.formGroup.get('password').value;

		if (password) {
			// generates the password hash to use as key
			const key = Tools.generateKey(password);

			// verify key hash from the database
			if (this.keyHash) {
				if (Tools.generateKey(key) != this.keyHash) {
					this.snackBar.open(this.d.l.cipherError, this.d.l.okLabel, {duration: 2000});
					// FIXME: use dialog insted to allow changing password
					return;
				}
			} else {
				this.keyHash = Tools.generateKey(key);
			}

			// store the key locally
			this.cal.setKey(key);
		}

		this.cal.setSettings(
			new Settings(
				this.formGroup.get('resources').value,
				this.formGroup.get('icsDownload').value,
				this.formGroup.get('assosEventsByDefault').value,
				this.keyHash
			)
		).then(() => {
			this.snackBar.open(this.d.l.updatedResourcesInfo, this.d.l.okLabel, {duration: 2000});
			this.ngZone.run(() => this.router.navigateByUrl('/calendar'));
		});
	}

	gatherFromZenith() {
		this.dialog.open(LoginDialogComponent, {
			data: {
				title: this.d.l.ZenithCredentialsDialogTitle,
				content: this.d.l.ZenithCredentialsDialogContent
			}
		}).afterClosed().subscribe(credentials => {
			if (!credentials) return;
			let snackBarRef = this.snackBar.open(this.d.l.waitZenithConnectionInfo);

			this.http.post(
				environment.proxy.domain + 'action=fetch_ade',
				credentials,
				{ responseType: 'text'}
			).subscribe(
				(text: string) => {
					snackBarRef.dismiss();
					if (text.startsWith('invalid')) return this.snackBar.open(this.d.l.invalidZenithCredentialsError, this.d.l.okLabel, {duration: 2000});
					if (text.startsWith('dangerous')) return this.snackBar.open(this.d.l.dangerousZenithCredentialsError, this.d.l.okLabel, {duration: 2000});
					this.formGroup.get('resources').setValue(text);
				},
				(error) => {
					snackBarRef.dismiss();
					this.snackBar.open(this.d.l.ZenithConnectionError, this.d.l.okLabel, {duration: 2000});
				}
			);
		});
	}
}
