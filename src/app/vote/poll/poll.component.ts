import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { MatSnackBar } from '@angular/material';

import { VoteService } from '../vote-service/vote.service';
import { DicoService } from '../../language/dico.service';

import { VoteSnackbarComponent } from './vote-snackbar/vote-snackbar.component';

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
  selectedChoice: Choice;

  pollWatcher: any;
  choicesWatcher: any;

  constructor(
    private vote: VoteService,
    private route: ActivatedRoute,
    private location: Location,
    public snackBar: MatSnackBar,
    public d: DicoService,
  ) {
    this.selectedChoice = null;
  }

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

  onVote(choice: Choice){
    this.selectedChoice = choice;
  }

  onConfirm(selectedChoice) {
    this.vote.sendVote(this.poll.id, selectedChoice.id)
    .then(() => {
      this.message();
    })
    .catch((error) => {
      console.log(error);
    });
    this.location.back();
  }

  private message() {
    this.snackBar.openFromComponent(VoteSnackbarComponent, { duration: 3000 });
  }

  onCancel() {
    this.selectedChoice = null;
  }


}
