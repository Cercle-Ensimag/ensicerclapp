import { takeUntil } from 'rxjs/operators';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CalService, Settings } from '../cal-service/cal.service';
import { Tools } from '../../providers/tools.service';
import { DicoService } from '../../language/dico.service';
import { LoginDialogComponent } from '../../shared-components/login-dialog/login-dialog.component';
import { DeleteDialogComponent } from '../../shared-components/delete-dialog/delete-dialog.component';
import { environment } from '../../../environments/environment';

import { Subject, combineLatest } from 'rxjs';

@Component({
	selector: 'app-cal-settings',
	templateUrl: './cal-settings.component.html',
	styleUrls: ['./cal-settings.component.css']
})


export class CalSettingsComponent implements OnInit, OnDestroy {
	private unsubscribe: Subject<void> = new Subject();
	private keyHash: string;
	private salt: string;
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
					keyHash: null,
					salt: null
				};
			this.formGroup = this.fb.group({
				resources: [settings.resources || '', [this.cal.resourcesValidator]],
				icsDownload: [settings.icsDownload || false, []],
				assosEventsByDefault: [settings.assosEventsByDefault || false, []],
				password: ['', []]
			});
			this.keyHash = settings.keyHash || null;
			this.salt = settings.salt || null;
			this.passwordOk = Tools.hashKey(key) == this.keyHash;
		});
	}

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	submit() {
		const password = this.formGroup.get('password').value;

		if (password) {
			if (this.keyHash && this.salt) {
				// A key was configured before
				var key = Tools.generateKey(password, this.salt);
				if (Tools.hashKey(key) != this.keyHash) {
					// The key is different
					this.openChangePasswdDialog(password);
				} else {
					// the key is the same as other devices
					this.saveSettings(key);
				}
			} else {
				// Create a key
				this.saveSettingsWithNewKey(password);
			}
		} else {
			this.saveSettings();
		}
	}

	openChangePasswdDialog(password: string) {
		this.dialog.open(DeleteDialogComponent, {
			data: {
				title: this.d.l.cipherChangePasswordTitle,
				content: this.d.l.cipherChangePasswordInfo
			},
			width: '450px'
		}).afterClosed().subscribe(result => {
			if (result) {
				// Change key
				this.saveSettingsWithNewKey(password);
			}
		});
	}

	saveSettingsWithNewKey(password: string) {
		// new salt
		this.salt = Tools.generateSalt();
		// new key
		this.saveSettings(
			Tools.generateKey(password, this.salt)
		);
	}

	saveSettings(key: string = null) {
		if (key) {
			// compute the key hash (can overwrite)
			this.keyHash = Tools.hashKey(key);
			// store the key locally
			this.cal.setKey(key);
		}

		this.cal.setSettings(
			new Settings(
				this.formGroup.get('resources').value,
				this.formGroup.get('icsDownload').value,
				this.formGroup.get('assosEventsByDefault').value,
				this.keyHash,
				this.salt
			)
		).then(() => {
			this.snackBar.open(this.d.l.updatedResourcesInfo, this.d.l.ok, {duration: 2000});
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
					if (text.startsWith('invalid')) return this.snackBar.open(this.d.l.invalidZenithCredentialsError, this.d.l.ok, {duration: 2000});
					if (text.startsWith('dangerous')) return this.snackBar.open(this.d.l.dangerousZenithCredentialsError, this.d.l.ok, {duration: 2000});
					this.formGroup.get('resources').setValue(text);
					this.formGroup.get('resources').markAsDirty();
					this.snackBar.open(this.d.l.ZenithConnectionOk, this.d.l.ok, {duration: 2000});
				},
				(error) => {
					snackBarRef.dismiss();
					this.snackBar.open(this.d.l.ZenithConnectionError, this.d.l.ok, {duration: 2000});
				}
			);
		});
	}
}
