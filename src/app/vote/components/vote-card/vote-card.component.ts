import {Component, Input, OnInit} from '@angular/core';
import {Tools} from '../../../providers/tools.service';
import {DicoService} from '../../../language/dico.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DeleteDialogComponent} from '../../../shared-components/delete-dialog/delete-dialog.component';
import {VoteService, Poll} from '../../vote-service/vote.service';
import {Observable, of} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';

@Component({
	selector: 'app-vote-card',
	templateUrl: './vote-card.component.html',
	styleUrls: ['./vote-card.component.css']
})
export class VoteCardComponent implements OnInit {
	@Input() admin: boolean = false;
	@Input() poll: Poll;

	constructor(
		private dialog: MatDialog,
		private snackBar: MatSnackBar,

		public d: DicoService,
		public vote: VoteService
	) { }

	ngOnInit() {
	}

	delete() {
		this.dialog.open(DeleteDialogComponent, {
			data: {
				title: this.d.l.deletePollDialogTitle,
				content: this.d.format(this.d.l.deleteEventDialogContent, this.poll.title)
			}
		}).afterClosed().subscribe(result => {
			if (result) {
				this.vote.deletePoll(this.poll.id).then(() =>
					this.snackBar.open(this.d.l.deletedPollInfo, this.d.l.okLabel, {duration: 2000})
				);
			}
		});
	}

	linkEnabled(): Observable<boolean> {
		return of(this.admin).pipe(
			flatMap(
				is => {
					if (is) {
						return of(false);
					} else {
						return this.vote.alreadyVotedTo(this.poll.id).pipe(
							map(has => !has)
						);
					}
				}
			)
		);
	}

	setStarted(started: boolean) {
		return this.vote.setStarted(this.poll.id, started);
	}

	choicesString(): string {
		return Object.keys(this.poll.choices).map(choice => this.poll.choices[choice].label).join(' - ');
	}

	getDescriptionPreview(poll: Poll): string {
		return Tools.truncate(poll.description);
	}
}
