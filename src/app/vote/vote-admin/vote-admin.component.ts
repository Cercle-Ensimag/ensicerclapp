import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { DeviceSizeService } from '../../providers/device-size.service';
import { VoteService } from '../vote-service/vote.service';
import { AuthService } from '../../auth/auth-service/auth.service';
import { ListService } from '../../providers/list.service';
import { ToolsService } from '../../providers/tools.service';
import { DicoService } from '../../language/dico.service';

export class Assessor {
  emailId: string;
}

@Component({
  selector: 'app-vote-admin',
  templateUrl: './vote-admin.component.html',
  styleUrls: ['./vote-admin.component.css']
})
export class VoteAdminComponent implements OnInit, OnDestroy {

  deletePollId: string;
  deletePollTitle: string;

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
    public d: DicoService
  ) {
    this.deletePollId = null;
  }

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

  delete(pollId: string, pollTitle: string) {
    this.deletePollId = pollId;
    this.deletePollTitle = pollTitle;
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
