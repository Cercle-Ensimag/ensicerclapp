import {Component, Input, OnInit} from '@angular/core';
import {ToolsService} from '../../../providers/tools.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DeleteDialogComponent} from '../../../shared-components/delete-dialog/delete-dialog.component';
import {VoteService} from '../../vote-service/vote.service';
import {Poll} from '../../poll/poll.component';

@Component({
  selector: 'app-vote-card',
  templateUrl: './vote-card.component.html',
  styleUrls: ['./vote-card.component.css']
})
export class VoteCardComponent implements OnInit {

  @Input() admin: boolean = false;
  @Input() poll: Poll;

  constructor(
    private tools: ToolsService,
    public vote: VoteService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  delete() {
    this.dialog.open(DeleteDialogComponent, {
      data: {
        title: "Confirmation de la suppression",
        content: `Êtes-vous certain de vouloir supprimer "${this.poll.title}" ?`
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.vote.deletePoll(this.poll.id);
        this.snackBar.open("Vote supprimé", 'ok', {duration: 2000});
      }
    });
  }

  setStarted(started: boolean) {
    this.vote.setStarted(this.poll.id, started);
  }

  choicesString(): string{
    return Object.keys(this.poll.choices).map(choice => this.poll.choices[choice].label).join(' - ');
  }
}
