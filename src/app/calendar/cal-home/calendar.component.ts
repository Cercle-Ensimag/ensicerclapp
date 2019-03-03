import {Component, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Location} from '@angular/common';

import {DicoService} from '../../language/dico.service';
import {CalService} from '../cal-service/cal.service';

import {Subject, Observable, pipe} from 'rxjs';
import {takeUntil, map} from 'rxjs/operators';

const DAY_LENGTH = 24 * 60 * 60* 1000;

@Component({
	selector: 'app-calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

	private unsubscribe: Subject<void> = new Subject();

	constructor(
		private cal: CalService,
		private dialog: MatDialog,
		private snackBar: MatSnackBar,
		public location: Location,
		public d: DicoService
	) {
	}

	ngOnInit() {
		this.cal.getErrorNotifier().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(
			message => this.snackBar.open(message, this.d.l.ok, {duration: 2000})
		);
	}

	refreshADE() {
		this.cal.refreshADE();
	}
	needRefreshADE(): boolean {
		return this.cal.needRefreshADE();
	}

	displayICSDownload(): Observable<boolean> {
		return this.cal.getSettings().pipe(
			map(settings => settings ? settings.icsDownload : false)
		);
	}

	saveICS() {
		this.cal.saveICS();
	}

}
