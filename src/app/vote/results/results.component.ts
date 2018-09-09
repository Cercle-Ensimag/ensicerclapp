import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

import {VoteService} from '../vote-service/vote.service';

import {DicoService} from '../../language/dico.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  private _totalVotes: Observable<number>;

  public id: string;

  constructor(
    private route: ActivatedRoute,

    public vote: VoteService,
    public location: Location,
    public d: DicoService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  totalVotes(): Observable<number> {
    if (!this._totalVotes) {
      this._totalVotes = this.vote.getAllResults(this.id)
        .map((results: { [$choiceId: string]: number }) => Object.values(results).reduce((sum, cur) => sum + cur), 0)
        .shareReplay(1);
    }
    return this._totalVotes;
  }

  percent(choiceId: string): Observable<string> {
    return Observable.combineLatest(
      this.totalVotes(),
      this.vote.getResults(this.id, choiceId))
      .map(([total, partial]) => total ? (100 * partial/total).toFixed(2) : '0.00');
  }

}
