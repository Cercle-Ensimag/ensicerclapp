import { Component, OnInit, OnDestroy } from '@angular/core';

import { CafetService, CafetUser } from '../../cafet-service/cafet.service';
import { DicoService } from '../../../language/dico.service';


@Component({
  selector: 'app-cafet-admin-accounts',
  templateUrl: './cafet-admin-accounts.component.html',
  styleUrls: ['./cafet-admin-accounts.component.css']
})
export class CafetAdminAccountsComponent implements OnInit, OnDestroy {

  users: CafetUser[];
  usersWatcher: any;

  constructor(
    public cafet: CafetService,
    public d: DicoService
  ) { }

  ngOnInit() {
    this.usersWatcher = this.watchUsers();
  }

  ngOnDestroy() {
    this.usersWatcher.unsubscribe();
  }

  watchUsers() {
    return this.cafet.getUsers().subscribe(users => {
      this.users = users;
    });
  }

}
