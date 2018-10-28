import {Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DeleteDialogComponent} from '../../../shared-components/delete-dialog/delete-dialog.component';
import {Event, EventsService} from '../../events-service/events.service';
import {ToolsService} from '../../../providers/tools.service';
import {DicoService} from '../../../language/dico.service';
import {Observable} from 'rxjs';

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

    public d: DicoService,
    public tools: ToolsService,
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
          this.snackBar.open(this.d.l.deletedEventInfo, this.d.l.okLabel, {duration: 2000})
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
    return this.tools.setDayTime(this.event.start, "00:00:00") == this.tools.setDayTime(this.event.end, "00:00:00")
  }

	getGroupName(groupId: string): Observable<string> {
		return this.events.getGroupName(groupId);
	}

	getEventGroupIds(event: Event): string[] {
		return this.events.getEventGroupIds(event);
	}
}
