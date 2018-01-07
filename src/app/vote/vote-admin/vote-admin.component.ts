import { Component, OnInit, OnDestroy } from '@angular/core';

import { VoteService } from '../vote-service/vote.service';

import { DicoService } from '../../language/dico.service';

@Component({
  selector: 'app-vote-admin',
  templateUrl: './vote-admin.component.html',
  styleUrls: ['./vote-admin.component.css']
})
export class VoteAdminComponent {

  deletePollId: string;

  constructor(
    private vote: VoteService,
    public d: DicoService
  ) {
    this.deletePollId = null;
  }

  ngOnInit () {
    this.vote.start();
  }

  ngOnDestroy () {
    this.vote.stop();
  }

  delete(pollId: string) {
    this.deletePollId = pollId;
  }

  back() {
    this.deletePollId = null;
  }

  confirmDelete() {
    this.vote.deletePoll(this.deletePollId);
    this.back();
  }

  setStarted(pollId: string, started: boolean) {
    this.vote.setStarted(pollId, started);
  }

}
