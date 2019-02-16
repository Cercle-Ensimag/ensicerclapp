import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatSnackBar} from '@angular/material';

import {CafetService, CafetUser} from '../../cafet-service/cafet.service';
import {Tools} from '../../../providers/tools.service';
import {DeviceSizeService} from '../../../providers/device-size.service';
import {DicoService} from '../../../language/dico.service';
import {ListService} from '../../../providers/list.service';

import {CafetHistoryComponent} from '../../cafet-history/cafet-history.component';
import {EditCafetUserComponent} from '../edit-cafet-user/edit-cafet-user.component';
import {Observable, Subject} from 'rxjs';
import {DeleteDialogComponent} from '../../../shared-components/delete-dialog/delete-dialog.component';
import {first, map, takeUntil} from 'rxjs/operators';


@Component({
	selector: 'app-cafet-admin-users',
	templateUrl: './cafet-admin-users.component.html',
	styleUrls: ['./cafet-admin-users.component.css']
})
export class CafetAdminUsersComponent implements OnInit {
	public formGroup: FormGroup;
	public controls: {
		[emailId: string]: {
			add: FormControl,
			sub: FormControl
		}
	};
	public editing: boolean;
	private unsubscribe: Subject<void> = new Subject();
	private usersObs: Observable<CafetUser[]>;
	private hasChanged: boolean = false;

	constructor(
		private list: ListService,
		private fb: FormBuilder,
		private dialog: MatDialog,
		private snackBar: MatSnackBar,
		public cafet: CafetService,
		public media: DeviceSizeService,
		public d: DicoService
	) {
	}

	ngOnInit() {
		this.initFormGroup();
	}

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	initFormGroup() {
		this.formGroup = this.fb.group({
			firstName: ['', [Validators.required, Validators.maxLength(30)]],
			lastName: ['', [Validators.required, Validators.maxLength(30)]],
			email: ['', [Validators.email, Validators.maxLength(50)]],
			credit: [0, []],
			byCredit: [],
			byDate: []
		});
		this.formGroup.valueChanges.subscribe(() => this.hasChanged = true);

		this.cafet.getUsers().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(users => {
			this.controls = {};
			for (let user of users) {
				this.controls[user.emailId] = {
					add: new FormControl('', [Validators.required, Validators.max(1000), Validators.min(0.1)]),
					sub: new FormControl('', [Validators.required, Validators.max(1000), Validators.min(0.1)])
				};
			}
		});
	}

	getEmail(): string {
		return this.formGroup.get('email').value.toLowerCase();
	}

	// Accounts

	tryCreateCafetAccount() {
		const email = this.getEmail();

		this.list.isInList(email).pipe(
			first()
		).subscribe(notExte => {
			if (!notExte) {
				this.dialog.open(DeleteDialogComponent, {
					data: {
						title: this.d.l.confirmCafetAccountCreationDialogTitle,
						content: this.d.format(this.d.l.confirmCafetAccountCreationDialogContent, email)
					}
				}).afterClosed()
					.pipe(first())
					.subscribe(result => {
						if (result) {
							this.createCafetAccount(true);
						}
					});
			} else {
				this.createCafetAccount(false);
			}
		});
	}

	createCafetAccount(exte: boolean) {
		const email = this.getEmail();
		const emailId = Tools.getEmailIdFromEmail(email);
		const credit = this.formGroup.get('credit').value;
		const user = {
			credit: 0,
			activated: true,
			emailId: (exte ? '%exte%' : '') + emailId,
			creationDate: (new Date()).getTime(),
			lastTransactionDate: (new Date()).getTime(),
			profile: {
				firstName: Tools.titleCase(this.formGroup.get('firstName').value),
				lastName: Tools.titleCase(this.formGroup.get('lastName').value),
				email: email,
				exte: exte
			}
		};
		this.cafet.setUserAccount(user).then(
			() => this.cafet.newTransaction(user, credit)
		).then(
			() => {
				this.formGroup.reset({
					firstName: '',
					lastName: '',
					email: '',
					credit: 0
				});
				this.snackBar.open(this.d.format(this.d.l.informAboutCafetCreation, this.cafet.getUserName(user), credit.toFixed(2)),
					this.d.l.okLabel, {duration: 2000});
			}
		).catch(
			err => this.snackBar.open(err, this.d.l.okLabel, {duration: 2000})
		);
	}

	getUsers(): Observable<CafetUser[]> {
		if (!this.usersObs || this.hasChanged) {
			this.usersObs = this.cafet.getUsers().pipe(map(
				users => this.filteredUsers(users)
			));
			this.hasChanged = false;
		}
		return this.usersObs;
	}

	filteredUsers(users: CafetUser[]): CafetUser[] {
		const email = this.getEmail();
		const emailId = Tools.getEmailIdFromEmail(email);
		let fUsers = users.filter(
			user => user.emailId.includes(emailId)
			|| this.cafet.getUserName(user).includes(Tools.titleCase(email))
		)
		fUsers.sort((u1, u2) => {
			if (u1.profile.firstName < u2.profile.firstName) return -1;
			if (u1.profile.firstName > u2.profile.firstName) return 1;
			if (u1.profile.lastName < u2.profile.lastName) return -1;
			return 1;
		});
		if (this.formGroup.get('byDate').value) {
			fUsers.sort((u1, u2) => u1.lastTransactionDate - u2.lastTransactionDate);
		}
		if (this.formGroup.get('byCredit').value) {
			fUsers.sort((u1, u2) => u1.credit - u2.credit);
		}
		return fUsers;
	}

	// transactions

	transaction(user: CafetUser, add: boolean) {
		let value;
		if (add) {
			value = this.controls[user.emailId].add.value;
		} else {
			value = -this.controls[user.emailId].sub.value;
		}
		this.controls[user.emailId].add.setValue('');
		this.controls[user.emailId].sub.setValue('');
		this.cafet.newTransaction(user, value).then(
			() => {
				this.snackBar.open(this.d.format(this.d.l.informAboutTransaction, this.cafet.getUserName(user), value.toFixed(2)), this.d.l.okLabel, {duration: 2000});
			}
		).catch(
			err => this.snackBar.open(err, this.d.l.okLabel, {duration: 2000})
		);
	}

	openHistory(user: CafetUser): void {
		this.dialog.open(CafetHistoryComponent, {
			data: {user: user, day: false},
			width: '450px'
		});
	}

	openEditor(user: CafetUser): void {
		this.dialog.open(EditCafetUserComponent, {
			data: user,
			width: '450px'
		});
	}

}
