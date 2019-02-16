import {Component, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';

import {DicoService} from '../../language/dico.service';
import {DeviceSizeService} from '../../providers/device-size.service';
import {Location} from '@angular/common';
import {EditCalComponent} from '../edit-cal/edit-cal.component';
import {CalService} from '../cal-service/cal.service';

import {Observable, pipe} from 'rxjs';
import {map} from 'rxjs/operators';

const DAY_LENGTH = 24 * 60 * 60* 1000;

@Component({
	selector: 'app-calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
	public daysOfTheWeek = [];
	public selectedDay: Date = new Date();

	constructor(
		private cal: CalService,
		private dialog: MatDialog,
		private snackBar: MatSnackBar,
		public media: DeviceSizeService,
		public location: Location,
		public d: DicoService
	) {
	}

	ngOnInit() {
		this.cal.getErrorNotifier().subscribe(
			message => this.snackBar.open(message, this.d.l.okLabel, {duration: 2000})
		);
		this.selectedDay = new Date();
		this.updateDaysOfTheWeek();
	}

	updateDaysOfTheWeek() {
		let monday = new Date(this.selectedDay);
		while (monday.getDay()!== 1){
			monday = new Date(monday.getTime() - DAY_LENGTH);
		}
		this.daysOfTheWeek = [
			monday,
			new Date(monday.getTime() + DAY_LENGTH),
			new Date(monday.getTime() + DAY_LENGTH * 2),
			new Date(monday.getTime() + DAY_LENGTH * 3),
			new Date(monday.getTime() + DAY_LENGTH * 4),
			new Date(monday.getTime() + DAY_LENGTH * 5),
			new Date(monday.getTime() + DAY_LENGTH * 6)
		];
	}

	previousDay() {
		this.selectedDay = new Date(this.selectedDay.getTime() - DAY_LENGTH);
	}

	nextDay() {
		this.selectedDay = new Date(this.selectedDay.getTime() + DAY_LENGTH);
	}

	previousWeek() {
		this.selectedDay = new Date(this.selectedDay.getTime() - DAY_LENGTH * 7);
		this.updateDaysOfTheWeek();
	}

	nextWeek() {
		this.selectedDay = new Date(this.selectedDay.getTime() + DAY_LENGTH * 7);
		this.updateDaysOfTheWeek();
	}

	openCreateEvent(): void {
		this.dialog.open(EditCalComponent, {
			data: {day: this.selectedDay, id: "-"},
			width: '450px'
		});
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
