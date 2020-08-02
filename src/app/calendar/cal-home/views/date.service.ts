import { Injectable, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DicoService } from '../../../language/dico.service';
import { CalService, CalEvent } from '../../cal-service/cal.service';
import { EditCalComponent } from '../../edit-cal/edit-cal.component';

import { Subject, Observable, pipe } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const DAY_LENGTH = 24 * 60 * 60* 1000;

@Injectable()
export class DateService {
	private key: string;
	private unsubscribe: Subject<void> = new Subject();

	public daysOfTheWeek: Date[] = [];
	public selectedDay: Date = new Date();

	constructor(
		private cal: CalService,
		private dialog: MatDialog,
		public d: DicoService
	) {
		this.cal.getKey().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(key => this.key = key);

		this.selectedDay = new Date();

		this.updateDaysOfTheWeek();
	}

	getMyEventsForDay(date: Date): Observable<CalEvent[]> {
		return this.cal.getMyEventsForDay(date);
	}

	setSelectedDay(day: Date): void {
		this.selectedDay = day;
		this.updateDaysOfTheWeek();
	}

	getSelectedDay(): Date {
		return this.selectedDay;
	}

	getDaysOfTheWeek(): Date[] {
		return this.daysOfTheWeek;
	}

	updateDaysOfTheWeek(): void {
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

	previousDay(): void {
		this.selectedDay = new Date(this.selectedDay.getTime() - DAY_LENGTH);
	}

	nextDay(): void {
		this.selectedDay = new Date(this.selectedDay.getTime() + DAY_LENGTH);
	}

	previousWeek(): void {
		this.selectedDay = new Date(this.selectedDay.getTime() - DAY_LENGTH * 7);
		this.updateDaysOfTheWeek();
	}

	nextWeek(): void {
		this.selectedDay = new Date(this.selectedDay.getTime() + DAY_LENGTH * 7);
		this.updateDaysOfTheWeek();
	}

	goToCalendarEditEvent(): void {
		this.dialog.open(EditCalComponent, {
			data: {day: this.selectedDay, id: "-"},
			width: '450px'
		});
	}

	goToCalendarEditAll(): void {
		this.cal.goToCalendarEditAll();
	}

	goToCalendarSettings(): void {
		this.cal.goToCalendarSettings();
	}

	getTitle(event: CalEvent): string {
		return event.getTitle(this.key);
	}

	getLocation(event: CalEvent): string {
		return event.getLocation(this.key);

	}
}
