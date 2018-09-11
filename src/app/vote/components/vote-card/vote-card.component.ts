import {Component, Input, OnInit} from '@angular/core';
import {ToolsService} from '../../../providers/tools.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DeleteDialogComponent} from '../../../shared-components/delete-dialog/delete-dialog.component';
import {VoteService} from '../../vote-service/vote.service';
import {Poll} from '../../poll/poll.component';
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
    public vote: VoteService,
    public tools: ToolsService,
  ) {
  }

  ngOnInit() {
  }

  delete() {
    this.dialog.open(DeleteDialogComponent, {
      data: {
        title: 'Confirmation de la suppression',
        content: `Êtes-vous certain de vouloir supprimer le scrutin "${this.poll.title}" ?`
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.vote.deletePoll(this.poll.id).then(() =>
          this.snackBar.open('Scrutin supprimé', 'ok', {duration: 2000})
        );
      }
    });
  }

  linkEnabled(): Observable<boolean> {
    return of(this.admin).pipe(
      flatMap(is => is ? of(false) : this.vote.alreadyVotedTo(this.poll.id).pipe(map(has => !has))));
  }

  setStarted(started: boolean) {
    return this.vote.setStarted(this.poll.id, started);
  }

  choicesString(): string {
    return Object.keys(this.poll.choices).map(choice => this.poll.choices[choice].label).join(' - ');
  }
}
