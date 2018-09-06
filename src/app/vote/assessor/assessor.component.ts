import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

import {DeviceSizeService} from '../../providers/device-size.service';
import {ENSIDOMAIN, PHELMADOMAIN} from '../../auth/auth-service/auth.service';
import {VoteService} from '../vote-service/vote.service';
import {ListService} from '../../providers/list.service';
import {ToolsService} from '../../providers/tools.service';
import {DicoService} from '../../language/dico.service';

import {VoteUser} from '../vote-users/vote-users.component';
import {Poll} from '../poll/poll.component';
import {Observable} from '../../../../node_modules/rxjs';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/mergeMap';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-assessor',
  templateUrl: './assessor.component.html',
  styleUrls: ['./assessor.component.css']
})
export class AssessorComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  polls: Poll[];

  checked: {
    [pollId: string]: boolean
  } = {};

  domains: string[];

  constructor(
    private vote: VoteService,
    private route: ActivatedRoute,
    private location: Location,
    public media: DeviceSizeService,
    private fb: FormBuilder,
    private list: ListService,
    private tools: ToolsService,
    public d: DicoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.createSearchForm();
    this.vote.getStartedPolls().subscribe(polls => {
      this.polls = polls;
      this.createPollCheckboxesCtrl();
    });
    this.list.start();
  }

  ngOnDestroy() {
    this.list.stop();
  }

  createSearchForm() {
    this.domains = [
      "@" + ENSIDOMAIN,
      "@" + PHELMADOMAIN
    ];
    this.formGroup = this.fb.group({
      email: ['', [this.emailValidator]],
      domain: [this.domains[0], []]
    });
  }

  getEmail(): string {
    return this.formGroup.get('email').value;
  }
  getDomain(): string {
    return this.formGroup.get('domain').value;
  }

  createPollCheckboxesCtrl() {
    this.checked = {};
    for (let poll of this.polls) {
      this.checked[poll.id] = false;
    }
  }

  filteredUsers(): Observable<{userName: string, pollName: string}[]> {
    return this.vote.getAllStartedPollsUsers()
      .map((voteLists: {poll: Poll, users: VoteUser[]}[]) => {
        let toReturn = [];
        voteLists.filter((voteList: {poll: Poll, users: VoteUser[]}) => this.checked[voteList.poll.id])
          .forEach((voteList: {poll: Poll, users: VoteUser[]}) => {
          toReturn = toReturn.concat(
            voteList.users.filter((user: VoteUser) =>
              user.emailId.includes(this.tools.getEmailIdFromEmail(this.getEmail())))
              .map((user: VoteUser) => ({
                userName: this.tools.titleCase(user.emailId.split('|').join(' ')),
                pollName: voteList.poll.title}))
          );
        });
        return toReturn;
      });
  }

  buttonDisabled(): Observable<boolean> {
    return this.filteredUsers()
      .map(users => !!users.length || this.formGroup.invalid || this.noPollSelected())
  }

  markAsVoted() {
    const emailId = this.tools.getEmailIdFromEmail(this.getEmail());
    const name = this.tools.titleCase(emailId.replace('|', ' ').replace('  ', ' '));
    if (this.list.authUsers[emailId] !== this.getEmail() + this.getDomain()) {
      this.snackBar.open('Utilisateur inconnu', 'ok')
    } else {
      for (let poll of this.polls) {
        if (this.checked[poll.id]) {
          this.vote.markAsVoted(poll.id, this.getEmail());
        }
      }
      this.formGroup.get('email').setValue('');
      this.formGroup.get('domain').setValue(this.domains[0]);
      this.snackBar.open(this.d.format(this.d.l.markedAsVoted, name), 'ok', {duration: 2000});
    }
  }

  noPollSelected() {
    return !this.polls.some(poll => this.checked[poll.id]);
  }

  change(id, bool) {
    this.checked[id] = bool;
  }

  emailValidator (control: FormControl) {
    if (!control.value.match(/^[a-z]+((-|--)[a-z]+)*.[a-z]+((-|--)[a-z]+)*(|[0-9])$/)) {
      return { error: true };
    }
    return null;
  }

}
