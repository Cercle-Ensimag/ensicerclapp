import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

import {MatDialog, MatSnackBar} from '@angular/material';

import {VoteService} from '../vote-service/vote.service';
import {DicoService} from '../../language/dico.service';

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
export class PollComponent implements OnInit {
  private id: string;

  constructor(
    private vote: VoteService,
    private route: ActivatedRoute,
    private location: Location,
    private snackBar: MatSnackBar,
    private d: DicoService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  choose(choice: Choice){
    this.dialog.open(DeleteDialogComponent, {
      data: {
        title: "Confirmation du vote",
        content: `Êtes-vous certain de vouloir voter pour "${choice.label}" ?`
      }
    }).afterClosed()
      .first()
      .subscribe(result => {
        if (result) {
          this.vote.sendVote(this.id, choice.id)
          .then(() => {
            this.snackBar.open(`Vote pour "${choice.label}" enregistré`, 'ok', {duration: 2000});
            this.location.back();
          })
        }
      });
  }
}
