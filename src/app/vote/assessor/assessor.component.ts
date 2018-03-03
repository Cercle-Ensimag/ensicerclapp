import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { DeviceSizeService } from '../../providers/device-size.service';
import { AuthService, ENSIDOMAIN, PHELMADOMAIN } from '../../auth/auth-service/auth.service';
import { VoteService } from '../vote-service/vote.service';
import { ListService } from '../../providers/list.service';
import {ToolsService } from '../../providers/tools.service';
import { DicoService } from '../../language/dico.service';

import { VoteUser } from '../vote-users/vote-users.component';
import { Poll, Choice } from '../poll/poll.component';

@Component({
  selector: 'app-assessor',
  templateUrl: './assessor.component.html',
  styleUrls: ['./assessor.component.css']
})
export class AssessorComponent implements OnInit, OnDestroy {

  searchCtrl: FormGroup;
  displayedUsers: string[] = [];
  polls: Poll[];
  users: {
    [pollId: string]: VoteUser[];
  } = {};
  checked: {
    [pollId: string]: boolean
  } = {};
  usersWatchers: {
    [pollId: string]: any
  } = {};
  checkedWatchers: {
    [pollId: string]: any
  } = {};
  searchWatcher: any;

  domains: string[];
  error: string;

  pageIndex: number = 0;
  pageSize: number = 20;


  constructor(
    private vote: VoteService,
    private route: ActivatedRoute,
    private location: Location,
    private auth: AuthService,
    public media: DeviceSizeService,
    private fb: FormBuilder,
    private list: ListService,
    private tools: ToolsService,
    public d: DicoService
  ) {}

  ngOnInit() {
    this.createSearchForm();
    this.vote.getPolls().subscribe(polls => {
      this.polls = polls;
      this.createPollCheckboxesCtrl();
      this.watchUsers();
    })
    this.list.start();
  }

  ngOnDestroy() {
    this.stopWatchingUsers();
    this.list.stop();
  }

  createSearchForm() {
    this.domains = [
      "@" + ENSIDOMAIN,
      "@" + PHELMADOMAIN
    ];
    this.searchCtrl = this.fb.group({
      email: ['', [this.emailValidator]],
      domain: [this.domains[0], []]
    });
    if (this.searchWatcher) {
      this.searchWatcher.unsubscribe();
    }
    this.searchWatcher = this.searchCtrl.get('email').valueChanges.subscribe((email) => {
      this.sortUsers(email);
    });
    this.searchWatcher = this.searchCtrl.valueChanges.subscribe(() => {
      this.error = null;
    });
  }

  getEmail(): string {
    return this.searchCtrl.get('email').value;
  }
  getDomain(): string {
    return this.searchCtrl.get('domain').value;
  }

  createPollCheckboxesCtrl() {
    this.checked = {};
    for (let poll of this.polls) {
      this.checked[poll.id] = false;
    }
  }

  change(pollId: string, checked: boolean) {
    this.checked[pollId] = checked;
    if (this.checkedWatchers[pollId]) {
      this.checkedWatchers[pollId].unsubscribe();
    }
    if (checked) {
      this.checkedWatchers[pollId] = this.watchPollUsers(pollId);
    } else {
      this.sortUsers(this.getEmail());
    }
  }

  sortUsers(email: string) {
    let emailId = this.auth.getEmailIdFromEmail(email);
    this.displayedUsers = [];
    this.pageIndex = 0;
    for (let poll of this.polls) {
      if (this.checked[poll.id]) {
        this.displayedUsers = this.displayedUsers.concat(this.users[poll.id].filter(
          user => user.emailId.includes(emailId)
        ). map(
          user => this.tools.titleCase(user.emailId.split('|').join(' ')) + " <small>(" + poll.title + ")</small>"
        ));
      }
    }
  }

  updateList(event) {
    this.pageIndex = event.pageIndex;
  }

  watchUsers() {
    this.stopWatchingUsers();
    for (let poll of this.polls) {
      if (this.checked[poll.id]) {
        this.usersWatchers[poll.id] = this.watchPollUsers(poll.id);
      }
    }
  }

  stopWatchingUsers() {
    for (let poll of this.polls) {
      if (this.usersWatchers[poll.id]) {
        this.usersWatchers[poll.id].unsubscribe();
        this.usersWatchers[poll.id] = null;
      }
    }
  }

  watchPollUsers(pollId) {
    return this.vote.getUsers(pollId).subscribe(users => {
      this.users[pollId] = users;
      this.sortUsers(this.getEmail());
    });
  }

  markAsVoted() {
    if (!this.searchCtrl.invalid && this.displayedUsers.length == 0) {
      let emailId = this.auth.getEmailIdFromEmail(this.getEmail());
      let name = this.tools.titleCase(emailId.replace('|', ' ').replace('  ', ' '));
      if (this.list.authUsers[emailId] !== this.getEmail() + this.getDomain()) {
        this.error = this.d.format(this.d.l.notOnTheList, name);
      } else {
        for (let poll of this.polls) {
          if (this.checked[poll.id]) {
            this.vote.markAsVoted(poll.id, this.getEmail());
          }
        }
        this.searchCtrl.get('email').setValue("");
        this.searchCtrl.get('domain').setValue(this.domains[0]);
        this.error = this.d.format(this.d.l.markedAsVoted, name);
      }
    }
  }

  noPollAvailaible() {
    if (this.polls) {
      for (let poll of this.polls) {
        if (poll.started) {
          return false;
        }
      }
    }
    return true;
  }

  noPollSelected() {
    for (let poll of this.polls) {
      if (this.checked[poll.id]) {
        return false;
      }
    }
    return true;
  }

  emailValidator (control: FormControl) {
    if (!control.value.match(/^[a-z]+((-|--)[a-z]+)*.[a-z]+((-|--)[a-z]+)*$/)) {
      return { error: true };
    }
    return null;
  }

}
