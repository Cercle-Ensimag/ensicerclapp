import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

import {DeviceSizeService} from '../../providers/device-size.service';
import {VoteService} from '../vote-service/vote.service';
import {AuthService} from '../../auth/auth-service/auth.service';
import {ListService} from '../../providers/list.service';
import {ToolsService} from '../../providers/tools.service';
import {DicoService} from '../../language/dico.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs/Observable';

export class Assessor {
  emailId: string;
}

@Component({
  selector: 'app-vote-admin',
  templateUrl: './vote-admin.component.html',
  styleUrls: ['./vote-admin.component.css']
})
export class VoteAdminComponent implements OnInit, OnDestroy {
  private emailCtrl = new FormControl('', [this.auth.emailDomainValidator, Validators.email]);
  private selectedTab = 0;

  constructor(
    private auth: AuthService,
    private vote: VoteService,
    private media: DeviceSizeService,
    private list: ListService,
    private tools: ToolsService,
    private d: DicoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit () {
    this.list.start();
  }

  ngOnDestroy () {
    this.list.stop();
  }

  filteredUsers(): Observable<Assessor[]> {
    let emailId = this.tools.getEmailIdFromEmail(this.emailCtrl.value);
    return this.vote.getAssessors()
      .map(users => users.filter(
        user => user.emailId.includes(emailId)
      ));
  }

  addAssessor() {
    const emailId = this.tools.getEmailIdFromEmail(this.emailCtrl.value);
    if (!this.list.authUsers[emailId]) {
      let name = this.tools.titleCase(emailId.replace('|', ' ').replace('  ', ' '));
      this.snackBar.open(this.d.format(this.d.l.notOnTheList, name), 'ok', {duration: 2000});
    } else {
      this.vote.addAssessor(this.emailCtrl.value);
      this.emailCtrl.setValue("");
    }
  }

  tabChanged(event) {
    this.selectedTab = event.index;
  }
}
