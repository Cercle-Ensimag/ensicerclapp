import {Component, Input, OnInit} from '@angular/core';
import {CalService, CalEvent} from '../../cal-service/cal.service';
import {DicoService} from '../../../language/dico.service';
import {Tools} from '../../../providers/tools.service';
import {DeviceSizeService} from '../../../providers/device-size.service';
import {DeleteDialogComponent} from '../../../shared-components/delete-dialog/delete-dialog.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Subject, pipe} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
	selector: 'app-day-column',
	templateUrl: './day-column.component.html',
	styleUrls: ['./day-column.component.css']
})
export class DayColumnComponent implements OnInit {
	@Input() date: Date = new Date();

	private unsubscribe: Subject<void> = new Subject();
	private key: string;

	constructor(
		private dialog: MatDialog,
		private snackBar: MatSnackBar,

		public media: DeviceSizeService,
		public cal: CalService,
		public d: DicoService
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

}
