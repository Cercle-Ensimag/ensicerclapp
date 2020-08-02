
import { map, first, shareReplay } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CafetService, CafetUser } from '../../cafet-service/cafet.service';
import { DicoService } from '../../../language/dico.service';
import { Observable } from 'rxjs';

export class DayUser {
	user: CafetUser;
	transactions: DayTransaction[];
}
export class DayTransaction {
	id: string;
	value: number;
	date: number;
	resp: string;
}
@Component({
	selector: 'app-cafet-admin-accounts',
	templateUrl: './cafet-admin-accounts.component.html',
	styleUrls: ['./cafet-admin-accounts.component.css']
})
export class CafetAdminAccountsComponent implements OnInit {
	public editing: boolean = false;
	public reviewing: boolean = false;
	public pdf = null;
	private _dayTransactions: Observable<any>;

	constructor(
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
		public cafet: CafetService,
		public d: DicoService
	) { }

	ngOnInit() { }

	getDayTransactions() {
		if (!this._dayTransactions){
			this._dayTransactions = this.cafet.getDayTransactions().pipe(
				map(users => {
					const dayTransactions = [];
					Object.getOwnPropertyNames(users).forEach((emailId) => {
						const transactions = [];
						Object.getOwnPropertyNames(users[emailId]).forEach(transId => {
							transactions.push({
								id: transId,
								value: users[emailId][transId].value,
								date: users[emailId][transId].date,
								resp: users[emailId][transId].resp
							});
						});
						dayTransactions.push({
							user: {
								emailId: emailId,
								activated: null,
								credit: null,
								creationDate: null,
								lastTransactionDate: null,
								profile: null
							},
							transactions: transactions
						})
					});
					return dayTransactions;
				})
			).pipe(
				shareReplay(1)
			);
		}
		return this._dayTransactions;
	}

	validateDayTransactions() {
		this.cafet.validateDayTransactions().then(
			() => {},
			(error) => {
				this.snackBar.open(error, this.d.l.ok, {duration: 2000});
			}
		);
	}

	deleteDayTransaction(emailId: string, transId: string) {
		this.cafet.deleteDayTransaction(emailId, transId);
	}

	printAccountsPdf() {
		this.cafet.getUsers().pipe(
			first()
		).subscribe(users => {
			this.pdf = this.cafet.printAccountsPdf(users);
		});
	}

	saveAccountsPdf() {
		this.cafet.getUsers().pipe(
			first()
		).subscribe(users => {
			this.pdf = this.cafet.saveAccountsPdf(users);
		});
	}

}
