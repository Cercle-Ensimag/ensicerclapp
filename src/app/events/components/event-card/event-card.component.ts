import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDialogComponent } from '../../../shared-components/delete-dialog/delete-dialog.component';
import { Event, EventsService } from '../../events-service/events.service';
import { Tools } from '../../../providers/tools.service';
import { DicoService } from '../../../language/dico.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-event-card',
	templateUrl: './event-card.component.html',
	styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {
	@Input() admin: boolean = false;
	@Input() event: Event;

	constructor(
		private events: EventsService,
		private dialog: MatDialog,
		private snackBar: MatSnackBar,

		public d: DicoService
	) { }

	ngOnInit() {
	}

	delete() {
		this.dialog.open(DeleteDialogComponent, {
			data: {
				title: this.d.l.deleteEventDialogTitle,
				content: this.d.format(this.d.l.deleteEventDialogContent, this.event.title)
			}
		}).afterClosed().subscribe(result => {
			if (result) {
				this.events.deleteEvent(this.event.id).then(() =>
					this.snackBar.open(this.d.l.deletedEventInfo, this.d.l.ok, {duration: 2000})
				);
			}
		});
	}

	isNotPassed() {
		return this.event.end > Date.now();
	}

	isNow() {
		return this.event.start < Date.now() && this.isNotPassed();
	}

	color() {
		if (this.isNow()) {
			return "primary";
		} else {
			return '';
		}
	}

	singleDay() {
		return Tools.setDayTime(this.event.start, "00:00:00") == Tools.setDayTime(this.event.end, "00:00:00")
	}

	getGroupName(groupId: string): Observable<string> {
		return this.events.getGroupName(groupId);
	}

	getEventGroupIds(event: Event): string[] {
		return this.events.getEventGroupIds(event);
	}

	getDescriptionPreview(event: Event): string {
		return Tools.truncate(event.description);
	}
}
