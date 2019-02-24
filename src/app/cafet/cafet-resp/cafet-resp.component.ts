import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {Subject, Observable} from 'rxjs';
import {CafetService, CafetUser} from '../cafet-service/cafet.service';
import {Tools} from '../../providers/tools.service';
import {ListService} from '../../providers/list.service';
import {DeviceSizeService} from '../../providers/device-size.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DicoService} from '../../language/dico.service';
import {CafetHistoryComponent} from '../cafet-history/cafet-history.component';
import {map, takeUntil} from 'rxjs/operators';

@Component({
	selector: 'app-cafet-resp',
	templateUrl: './cafet-resp.component.html',
	styleUrls: ['./cafet-resp.component.css']
})
export class CafetRespComponent implements OnInit {
	private unsubscribe: Subject<void> = new Subject();

	public formGroup: FormGroup;
	public controls: {
		[emailId: string]: {
			add: FormControl,
			sub: FormControl
		}
	};

	constructor(
		private snackBar: MatSnackBar,
		private list: ListService,
		private dialog: MatDialog,
		private fb: FormBuilder,

		public location: Location,
		public cafet: CafetService,
		public media: DeviceSizeService,
		public d: DicoService
	) { }

	ngOnInit() {
		this.initFormGroup();
	}

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	initFormGroup() {
		this.formGroup = this.fb.group({
			email: ['', [Validators.email]],
			byCredit: [],
			byDate: []
		});

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

	filteredUsers(): Observable<CafetUser[]> {
		const email = this.formGroup.get('email').value;
		const emailId = Tools.getEmailIdFromEmail(email.split('@')[0]);
		return this.cafet.getUsers().pipe(
			map(users => {
				users = users.filter(
					user => user.emailId.includes(emailId)
						|| this.cafet.getUserName(user).includes(Tools.titleCase(email))
				);
				if (this.formGroup.get('byDate').value) {
					users.sort((u1, u2) => u1.lastTransactionDate - u2.lastTransactionDate);
				}
				if (this.formGroup.get('byCredit').value) {
					users.sort((u1, u2) => u1.credit - u2.credit);
				}
				return users;
			})
		);
	}

	// transactions

	getUserCredit(user: CafetUser): Observable<string> {
		return this.cafet.getDayTransactions().pipe(
			map(dayTransactions => {
				let credit = user.credit;
				if (dayTransactions[user.emailId]) {
					Object.getOwnPropertyNames(dayTransactions[user.emailId]).forEach((transId) => {
						credit += dayTransactions[user.emailId][transId].value;
					});
				}
				return credit.toFixed(2);
			})
		);
	}

	hasNoDayTransactions(user: CafetUser): Observable<boolean> {
		return this.cafet.getDayTransactions().pipe(
			map(dayTransactions => !dayTransactions[user.emailId])
		);
	}

	transaction(user: CafetUser, add: boolean) {
		let value;
		if (add){
			value = this.controls[user.emailId].add.value;
		} else {
			value = -this.controls[user.emailId].sub.value;
		}
		this.cafet.newDayTransaction(user, value).then(
			() => {
				this.controls[user.emailId].add.reset();
				this.controls[user.emailId].sub.reset();
				this.snackBar.open(
					this.d.format(
						this.d.l.informAboutTransaction,
						this.cafet.getUserName(user),
						value.toFixed(2)
					),
					this.d.l.ok,
					{duration: 2000}
				);
			}
		).catch(
			err => this.snackBar.open(err, this.d.l.ok, {duration: 2000})
		);
	}

	openHistory(user: CafetUser): void {
		this.dialog.open(CafetHistoryComponent, {
			data: {user: user, day: true},
			width: '450px'
		});
	}

}
