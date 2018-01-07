import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { VoteService } from '../vote-service/vote.service';
import { Poll, Choice } from '../poll/poll.component';

import { DicoService } from '../../language/dico.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit, OnDestroy {

  choices: Choice[];
  results: {
    [choiceId: string]: number;
  };

  pollWatcher: any;
  resultsWatcher: any[];

  constructor(
    private vote: VoteService,
    private route: ActivatedRoute,
    private location: Location,
    public d: DicoService
  ) {
    this.results = {};
    this.resultsWatcher = [];
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.pollWatcher = this.watchPoll(id);
  }

  ngOnDestroy() {
    if (this.pollWatcher) {
      this.pollWatcher.unsubscribe();
      this.pollWatcher = null;
    }
    for (let w of this.resultsWatcher) {
      if (w) { w.unsubscribe(); }
    }
    this.resultsWatcher = [];
  }

  watchPoll(pollId: string) {
    return this.vote.getChoices(pollId).subscribe((choices) => {
      this.choices = choices;
      this.watchResults(pollId);
    })
  }

  watchResults(pollId: string) {
    for (let choice of this.choices) {
      this.resultsWatcher.push(this.vote.getResults(pollId, choice.id).subscribe(results => {
        this.results[choice.id] = results.length;
      }));
    }
  }

  totalVotes(): number {
    let total: number = 0;
    for (let choice of this.choices) {
      total += this.results[choice.id];
    }
    return total;
  }

  percent(choiceId: string): number {
    return ((100 * this.results[choiceId]) / this.totalVotes()) || 0;
  }

  back() {
    this.location.back();
  }

}
