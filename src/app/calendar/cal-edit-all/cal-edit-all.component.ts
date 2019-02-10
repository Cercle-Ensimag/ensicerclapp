import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DicoService} from '../../language/dico.service';
import {ToolsService} from '../../providers/tools.service';
import {CalService, CalEvent} from '../cal-service/cal.service';
import {DeleteDialogComponent} from '../../shared-components/delete-dialog/delete-dialog.component';
import {EditCalComponent} from '../edit-cal/edit-cal.component';

import {Subject, pipe} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

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
		private snackBar: MatSnackBar,
		private tools: ToolsService
	) { }

	ngOnInit() {
		this.cal.getKey().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(key => this.key = key);
	}

	getCipheredField(cipher: boolean, field: string): string {
		if (!cipher) {
			return field;
		}
		if (this.key) {
			return this.tools.decipher(field, this.key) || "********";
		} else {
			return "********";
		}
	}

	getTitle(event: CalEvent): string {
		return this.getCipheredField(event.cipher, event.title);
	}

	getLocation(event: CalEvent): string {
		return this.getCipheredField(event.cipher, event.location);

	}

	removePersoEvent(event) {
		this.dialog.open(DeleteDialogComponent, {
			data: {
				title: this.d.l.deletePersoEventDialogTitle,
				content: this.d.format(this.d.l.deletePersoEventDialogContent, event.title)
			}
		}).afterClosed().subscribe(result => {
			if (result) {
				this.cal.removeEvent(event.id).then(() =>
					this.snackBar.open(this.d.l.deletedPersoEventInfo, this.d.l.okLabel, {duration: 2000})
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
