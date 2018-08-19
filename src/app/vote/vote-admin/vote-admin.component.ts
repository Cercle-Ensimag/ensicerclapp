import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { DeviceSizeService } from '../../providers/device-size.service';
import { VoteService } from '../vote-service/vote.service';
import { AuthService } from '../../auth/auth-service/auth.service';
import { ListService } from '../../providers/list.service';
import { ToolsService } from '../../providers/tools.service';
import { DicoService } from '../../language/dico.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DeleteDialogComponent} from '../../shared-components/delete-dialog/delete-dialog.component';
import {Poll} from '../poll/poll.component';

export class Assessor {
  emailId: string;
}

@Component({
  selector: 'app-vote-admin',
  templateUrl: './vote-admin.component.html',
  styleUrls: ['./vote-admin.component.css']
})
export class VoteAdminComponent implements OnInit, OnDestroy {

  emailCtrl: FormControl;
  emailWatcher: any;

  assessors: Assessor[];
  displayedUsers: Assessor[] = [];
  assessorsWatcher: any;

  error: string;

  constructor(
    private auth: AuthService,
    public vote: VoteService,
    public media: DeviceSizeService,
    private list: ListService,
    private tools: ToolsService,
    public d: DicoService,
  public dialog: MatDialog,
  private snackBar: MatSnackBar
  ) { }

  ngOnInit () {
    this.vote.start();
    this.assessorsWatcher = this.vote.getAssessors().subscribe(assess => {
      this.assessors = assess;
      this.sortUsers(this.emailCtrl.value);
    });
    this.createSearchForm();
    this.list.start();
  }

  ngOnDestroy () {
    this.vote.stop();
    this.assessorsWatcher.unsubscribe();
    this.list.stop();
  }

  delete(poll: Poll) {
    this.dialog.open(DeleteDialogComponent, {
      data: {
        title: "Confirmation de la suppression",
        content: `Êtes-vous certain de vouloir supprimer ${poll.title} ?`
      }
    }).afterClosed().subscribe(result => {
      if (result){
        this.vote.deletePoll(poll.id);
        this.snackBar.open("Vote supprimé", 'ok', {duration: 2000});
      }
    });
  }

  createSearchForm() {
    this.emailCtrl = new FormControl('', [this.auth.emailDomainValidator, Validators.email]);
    this.emailCtrl.valueChanges.subscribe((email) => {
      this.sortUsers(email);
      this.error = null;
    });
  }

  sortUsers(email: string) {
    let emailId = this.tools.getEmailIdFromEmail(email.split('@')[0]);
    this.displayedUsers = this.assessors.filter(
      user => user.emailId.includes(emailId)
    );
  }

  addAssessor() {
    if (!this.emailCtrl.invalid && this.displayedUsers.length == 0) {
      let emailId = this.tools.getEmailIdFromEmail(this.emailCtrl.value);
      if (!this.list.authUsers[emailId]) {
        let name = this.tools.titleCase(emailId.replace('|', ' ').replace('  ', ' '));
        this.error = this.d.format(this.d.l.notOnTheList, name);
      } else {
        this.vote.addAssessor(this.emailCtrl.value);
        this.emailCtrl.setValue("");
      }
    }
  }
}
