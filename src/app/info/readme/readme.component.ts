import {Component, OnInit} from '@angular/core';

import {AuthService} from '../../auth/auth-service/auth.service';
import {DicoService} from '../../language/dico.service';

import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-readme',
  templateUrl: './readme.component.html',
  styleUrls: ['../info.component.css']
})
export class ReadmeComponent implements OnInit {

  constructor(
    public auth: AuthService,
    public d: DicoService
  ) {
  }

  ngOnInit() {
  }

  canReadVotes() {
    return combineLatest(
      this.auth.isAdminOf('vote'),
      this.auth.isAdmin()
    ).pipe(map(([b1, b2]) => b1 || b2));
  }

  canReadVotesResults() {
    return combineLatest(
      this.auth.isAdminOf('vote'),
      this.auth.isAssessor(),
      this.auth.isAdmin()
    ).pipe(map(([b1, b2, b3]) => b1 || b2 || b3));
  }

  canReadEventsAdmin() {
    return combineLatest(
      this.auth.isAdminOf('events'),
      this.auth.isAdmin()
    ).pipe(map(([b1, b2]) => b1 || b2));
  }

  canReadEvents() {
    return combineLatest(
      this.auth.isAdminOf('events'),
      this.auth.isRespCom(),
      this.auth.isAdmin()
    ).pipe(map(([b1, b2, b3]) => b1 || b2 || b3));
  }

  canReadActusAdmin() {
    return combineLatest(
      this.auth.isAdminOf('vote'),
      this.auth.isAdmin()
    ).pipe(map(([b1, b2]) => b1 || b2));
  }

  canReadActus() {
    return combineLatest(
      this.auth.isAdminOf('vote'),
      this.auth.isJournalist(),
      this.auth.isAdmin()
    ).pipe(map(([b1, b2, b3]) => b1 || b2 || b3));
  }

  canReadCafetAdmin() {
    return combineLatest(
      this.auth.isAdmin(),
      this.auth.isAdminOf('cafet')
    ).pipe(map(([b1, b2]) => b1 || b2));
  }

}
