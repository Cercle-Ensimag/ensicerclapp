import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatPaginator, MatTableDataSource} from '@angular/material';

import {map, shareReplay} from 'rxjs/operators';

import {CafetService, CafetUser} from '../cafet-service/cafet.service';
import {DicoService} from '../../language/dico.service';
import {Observable} from 'rxjs';

class Log {
	date: number;
	value: string;
}

@Component({
	selector: 'app-cafet-history',
	templateUrl: './cafet-history.component.html',
	styleUrls: ['./cafet-history.component.css']
})
export class CafetHistoryComponent {
	@ViewChild(MatPaginator, { static : false }) paginator: MatPaginator;
	private _data: Observable<MatTableDataSource<Log>>;

	constructor(
		@Inject(MAT_DIALOG_DATA) private data: {user: CafetUser, day: boolean},
		public cafet: CafetService,
		public d: DicoService
	) { }

	ngOnInit() { }

	getData(): Observable<MatTableDataSource<Log>>{
		if (!this._data){
			if (this.data.day) {
				this._data = this.cafet.getDayTransactions().pipe(
					map(transactions => {
						const dayTr = transactions[this.data.user.emailId];
						const logs: Log[] = [];
						Object.getOwnPropertyNames(dayTr).reverse().forEach(transId => {
							logs.push({
								date: dayTr[transId].date,
								value: dayTr[transId].value.toFixed(2) + '€'
							});
						});
						const toReturn = new MatTableDataSource<Log>([]);
						toReturn.data = logs;
						setTimeout(() => toReturn.paginator = this.paginator);
						return toReturn;
					}),
					shareReplay(1)
				);
			} else {
				this._data = this.cafet.getHistory(this.data.user.emailId).pipe(
					map(history => {
						const logs: Log[] = [];
						history.forEach(trans => {
							logs.push({
								date: trans.date,
								value: trans.value.toFixed(2) + '€'
							})
						});
						logs.push({
							date: this.data.user.creationDate,
							value: this.d.l.cafetAccountCreationDateLabel
						});
						const toReturn = new MatTableDataSource<Log>([]);
						toReturn.data = logs;
						setTimeout(() => toReturn.paginator = this.paginator);
						return toReturn;
					}),
					shareReplay(1)
				);
			}
		}
		return this._data;
	}

	isPlus(log: Log) {
		return log.value.match(/^[0-9]/);
	}

	isMinus(log: Log) {
		return log.value.match(/^-/);
	}
}
