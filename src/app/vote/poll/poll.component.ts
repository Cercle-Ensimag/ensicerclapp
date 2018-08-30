import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import {MatDialog, MatSnackBar} from '@angular/material';

import { VoteService } from '../vote-service/vote.service';
import { DicoService } from '../../language/dico.service';

import { VoteSnackbarComponent } from './vote-snackbar/vote-snackbar.component';
import {DeleteDialogComponent} from '../../shared-components/delete-dialog/delete-dialog.component';

export class Choice {
  id: string;
  label: string;
  short: string;
  image: string;
}

export class Poll {
  id: string;
  title: string;
  description: string;
  started: boolean;
  choices: any;
}

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent implements OnInit, OnDestroy {
  poll: Poll;
  choices: Choice[];

  pollWatcher: any;
  choicesWatcher: any;

  constructor(
    private vote: VoteService,
    private route: ActivatedRoute,
    private location: Location,
    private snackBar: MatSnackBar,
    private d: DicoService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.pollWatcher = this.watchPoll(id);
    this.choicesWatcher = this.watchChoices(id);
  }

  ngOnDestroy() {
    this.pollWatcher.unsubscribe();
    this.choicesWatcher.unsubscribe();
  }

  watchPoll(pollId: string) {
    return this.vote.getPoll(pollId).subscribe((poll) => {
      this.poll = poll;
    });
  }

  watchChoices(pollId: string) {
    return this.vote.getChoices(pollId).subscribe((choices) => {
      this.choices = choices;
    });
  }

  choose(choice: Choice){
    this.dialog.open(DeleteDialogComponent, {
      data: {
        title: "Confirmation de la suppression",
        content: `Êtes-vous certain de vouloir voter pour "${choice.label}" ?`
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.vote.sendVote(this.poll.id, choice.id)
        .then(() => {
          this.snackBar.open(`Vote pour "${choice.label}" enregistré`, 'ok', {duration: 2000});
          this.location.back();
        })
      }
    });
  }
}
