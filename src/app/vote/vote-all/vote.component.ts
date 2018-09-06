import { Component, OnInit, OnDestroy } from '@angular/core';
import { VoteService } from '../vote-service/vote.service';
import { DicoService } from '../../language/dico.service';
import {Location} from '@angular/common';


@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent {

  noPoll: boolean;

  constructor(
    public vote: VoteService,
    public d: DicoService,
    public location: Location
  ) {
    this.noPoll = true;
  }

  ngOnInit() {
    this.vote.start();
  }

  ngOnDestroy() {
    this.vote.stop();
  }
}
