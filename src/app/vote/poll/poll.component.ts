import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

import {MatDialog, MatSnackBar} from '@angular/material';
import {first} from 'rxjs/operators';

import {VoteService, Poll, Choice} from '../vote-service/vote.service';
import {DicoService} from '../../language/dico.service';

import {DeleteDialogComponent} from '../../shared-components/delete-dialog/delete-dialog.component';

@Component({
	selector: 'app-poll',
	templateUrl: './poll.component.html',
	styleUrls: ['./poll.component.css']
})
export class PollComponent implements OnInit {
	public id: string;

	constructor(
		private dialog: MatDialog,
		private route: ActivatedRoute,
		private snackBar: MatSnackBar,

		public vote: VoteService,
		public d: DicoService,
		public location: Location,

	) { }

	ngOnInit() {
		this.id = this.route.snapshot.paramMap.get('id');
	}

	choose(choice: Choice){
		this.dialog.open(DeleteDialogComponent, {
			data: {
				title: this.d.l.confirmVoteDialogTitle,
				content: this.d.format(this.d.l.confirmVoteDialogContent, choice.label)
			}
		}).afterClosed().pipe(
			first()
		).subscribe(result => {
			if (result) {
				this.vote.sendVote(this.id, choice.id).then(
					() => {
						this.snackBar.open(this.d.format(this.d.l.voteComfirmationMessage, choice.label), this.d.l.okLabel, {duration: 2000});
						this.location.back();
					},
					(reason) => this.snackBar.open(reason, this.d.l.okLabel, {duration: 2000})
				);
			}
		});
	}
}
