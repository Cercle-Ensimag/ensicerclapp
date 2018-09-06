import {Component, OnInit} from '@angular/core';

import {AuthService} from '../../auth/auth-service/auth.service';
import {DicoService} from '../../language/dico.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-readme',
  templateUrl: './readme.component.html',
  styleUrls: ['../info.component.css']
})
export class ReadmeComponent implements OnInit {

  constructor(
    public auth: AuthService,
    public d: DicoService
  ) { }

  canReadVotes() {
    return Observable.combineLatest(
      this.auth.isAdminOf('vote'),
      this.auth.isAdmin()
    ).map(([b1, b2]) => b1 || b2);
  }

  canReadVotesResults() {
    return Observable.combineLatest(
      this.auth.isAdminOf('vote'),
      this.auth.isAssessor(),
      this.auth.isAdmin()
    ).map(([b1, b2, b3]) => b1 || b2 || b3);
  }

  canReadEventsAdmin() {
    return Observable.combineLatest(
      this.auth.isAdminOf('events'),
      this.auth.isAdmin()
    ).map(([b1, b2]) => b1 || b2);
  }

  canReadEvents() {
    return Observable.combineLatest(
      this.auth.isAdminOf('events'),
      this.auth.isRespCom(),
      this.auth.isAdmin()
    ).map(([b1, b2, b3]) => b1 || b2 || b3);
  }

  canReadActusAdmin() {
    return Observable.combineLatest(
      this.auth.isAdminOf('vote'),
      this.auth.isAdmin()
    ).map(([b1, b2]) => b1 || b2);
  }

  canReadActus() {
    return Observable.combineLatest(
      this.auth.isAdminOf('vote'),
      this.auth.isJournalist(),
      this.auth.isAdmin()
    ).map(([b1, b2, b3]) => b1 || b2 || b3);
  }

  canReadCafetAdmin() {
    return Observable.combineLatest(
      this.auth.isAdmin(),
      this.auth.isAdminOf('cafet')
    ).map(([b1, b2]) => b1 || b2);
  }

  ngOnInit() { }

}
