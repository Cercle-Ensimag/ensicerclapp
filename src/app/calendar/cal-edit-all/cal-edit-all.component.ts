import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DicoService } from '../../language/dico.service';
import { Tools } from '../../providers/tools.service';
import { CalService, CalEvent } from '../cal-service/cal.service';
import { DeleteDialogComponent } from '../../shared-components/delete-dialog/delete-dialog.component';
import { EditCalComponent } from '../edit-cal/edit-cal.component';

import { Subject, pipe } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-cal-edit-all',
	templateUrl: './cal-edit-all.component.html',
	styleUrls: ['./cal-edit-all.component.css']
})
export class CalEditAllComponent implements OnInit {
	private unsubscribe: Subject<void> = new Subject();
	private key: string;

	public loading: boolean;

	constructor(
		public d: DicoService,
		public cal: CalService,
		public location: Location,
		private dialog: MatDialog,
		private snackBar: MatSnackBar
	) { }

	ngOnInit() {
		this.cal.getKey().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(key => this.key = key);
	}

	getTitle(event: CalEvent): string {
		return event.getTitle(this.key);
	}

	getLocation(event: CalEvent): string {
		return event.getLocation(this.key);

	}

	removePersoEvent(event) {
		this.dialog.open(DeleteDialogComponent, {
			data: {
				title: this.d.l.deletePersoEventDialogTitle,
				content: this.d.format(this.d.l.deletePersoEventDialogContent, this.getTitle(event))
			}
		}).afterClosed().subscribe(result => {
			if (result) {
				this.cal.removeEvent(event.id).then(() =>
					this.snackBar.open(this.d.l.deletedPersoEventInfo, this.d.l.ok, {duration: 2000})
				)
			}
		});

	}

	openCreateEvent(eventId: string): void {
		this.dialog.open(EditCalComponent, {
			data: {day: null, id: eventId},
			width: '450px'
		});
	}

}
