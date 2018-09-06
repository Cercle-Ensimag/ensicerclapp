import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {FormControl, Validators} from '@angular/forms';

import {DeviceSizeService} from '../../providers/device-size.service';
import {AuthService} from '../../auth/auth-service/auth.service';
import {VoteService} from '../vote-service/vote.service';
import {ListService} from '../../providers/list.service';
import {ToolsService} from '../../providers/tools.service';
import {DicoService} from '../../language/dico.service';
import {Observable} from 'rxjs/Observable';

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
  private emailCtrl = new FormControl('', [this.auth.emailDomainValidator, Validators.email]);
  private id: string;

  constructor(
    private vote: VoteService,
    private route: ActivatedRoute,
    private location: Location,
    private auth: AuthService,
    public media: DeviceSizeService,
    private list: ListService,
    public tools: ToolsService,
    public d: DicoService
  ) {}

  ngOnInit() {
    this.list.start();
  }

  ngOnDestroy() {
    this.list.stop();
  }

  filteredUsers(): Observable<VoteUser[]> {
    let emailId = this.tools.getEmailIdFromEmail(this.emailCtrl.value);
    return this.vote.getUsers(this.id)
      .map(users => users.filter(
        user => user.emailId.includes(emailId)
      ));
  }

}
