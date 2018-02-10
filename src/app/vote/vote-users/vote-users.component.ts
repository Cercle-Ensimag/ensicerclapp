import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { DeviceSizeService } from '../../providers/device-size.service';
import { AuthService } from '../../auth/auth-service/auth.service';
import { VoteService } from '../vote-service/vote.service';
import { Poll, Choice } from '../poll/poll.component';
import { ListService } from '../../providers/list.service';
import { DicoService } from '../../language/dico.service';

export class VoteUser {
  emailId: string;
  voted: boolean;
}
@Component({
  selector: 'app-vote-users',
  templateUrl: './vote-users.component.html',
  styleUrls: ['./vote-users.component.css']
})
export class VoteUsersComponent implements OnInit, OnDestroy {

  emailCtrl: FormControl;
  displayedUsers: VoteUser[] = [];
  users: VoteUser[];
  pollId: string;

  usersWatcher: any;
  error: string;

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
    this.pollId = this.route.snapshot.paramMap.get('id');
    this.createSearchForm();
    this.usersWatcher = this.watchUsers(this.pollId);
    this.list.start();
  }

  ngOnDestroy() {
    this.usersWatcher.unsubscribe();
    this.list.stop();
  }

  createSearchForm() {
    this.emailCtrl = new FormControl('', [this.auth.emailDomainValidator, Validators.email]);
    this.emailCtrl.valueChanges.subscribe((email) => {
      this.sortUsers(email);
      this.error = null;
    })
  }

  sortUsers(email: string) {
    let emailId = email.split('@')[0].replace('.', '|');
    if (email.length > 0) {
      this.displayedUsers = this.users.filter(user => user.emailId.includes(emailId));
    } else {
      this.displayedUsers = this.users;
    }
  }

  watchUsers(pollId: string) {
    return this.vote.getUsers(pollId).subscribe(users => {
      this.emailCtrl.setValue("");
      this.users = users;
      this.displayedUsers = users;
    });
  }

  back() {
    this.location.back();
  }

  markAsVoted() {
    if (!this.emailCtrl.invalid && this.displayedUsers.length == 0) {
      let emailId = this.auth.getEmailIdFromEmail(this.emailCtrl.value);
      if (!this.list.authUsers[emailId]) {
        this.error = this.titleCase(emailId.replace('|', ' ').replace('  ', ' ')) + " " + this.d.l.notOnTheList;
      } else {
        this.vote.markAsVoted(this.pollId, this.emailCtrl.value.toLowerCase());
      }
    }
  }

  titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
  }

}
