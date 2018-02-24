import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { DeviceSizeService } from '../../providers/device-size.service';
import { AuthService } from '../../auth/auth-service/auth.service';
import { VoteService } from '../vote-service/vote.service';
import { ListService } from '../../providers/list.service';
import { DicoService } from '../../language/dico.service';

import { VoteUser } from '../vote-users/vote-users.component';
import { Poll, Choice } from '../poll/poll.component';

@Component({
  selector: 'app-assessor',
  templateUrl: './assessor.component.html',
  styleUrls: ['./assessor.component.css']
})
export class AssessorComponent implements OnInit, OnDestroy {

  emailCtrl: FormControl;
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
  emailWatcher: any;

  error: string;

  pageIndex: number = 0;
  pageSize: number = 20;

  constructor(
    private vote: VoteService,
    private route: ActivatedRoute,
    private location: Location,
    private auth: AuthService,
    public media: DeviceSizeService,
    private list: ListService,
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
    this.emailCtrl = new FormControl('', [this.auth.emailDomainValidator, Validators.email]);
    if (this.emailWatcher) {
      this.emailWatcher.unsubscribe();
    }
    this.emailWatcher = this.emailCtrl.valueChanges.subscribe((email) => {
      this.sortUsers(email);
      this.error = null;
    });
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
      this.sortUsers(this.emailCtrl.value);
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
          user => this.titleCase(user.emailId.split('|').join(' ')) + " <small>(" + poll.title + ")</small>"
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
      this.sortUsers(this.emailCtrl.value);
    });
  }

  markAsVoted() {
    if (!this.emailCtrl.invalid && this.displayedUsers.length == 0) {
      let emailId = this.auth.getEmailIdFromEmail(this.emailCtrl.value);
      if (!this.list.authUsers[emailId]) {
        let name = this.titleCase(emailId.replace('|', ' ').replace('  ', ' '));
        this.error = this.d.format(this.d.l.notOnTheList, name);
      } else {
        for (let poll of this.polls) {
          if (this.checked[poll.id]) {
            this.vote.markAsVoted(poll.id, this.emailCtrl.value);
          }
        }
        this.emailCtrl.setValue("");
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

  titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
  }

}
