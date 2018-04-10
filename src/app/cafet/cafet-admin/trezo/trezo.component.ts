import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { CafetService, CafetUser } from '../../cafet-service/cafet.service';
import { ToolsService } from '../../../providers/tools.service';
import { DeviceSizeService } from '../../../providers/device-size.service';
import { DicoService } from '../../../language/dico.service';

import { CafetHistoryComponent } from '../../cafet-history/cafet-history.component';

@Component({
  selector: 'app-trezo',
  templateUrl: './trezo.component.html',
  styleUrls: ['./trezo.component.css']
})
export class TrezoComponent implements OnInit {

  users: CafetUser[];
  displayedUsers: CafetUser[] = [];
  usersWatcher: any;

  controls: {[emailId: string]: {
    add: FormControl,
    sub: FormControl
  }};

  expanded: {[emailId: string]: boolean};

  error: string;

  constructor(
    public cafet: CafetService,
    public tools: ToolsService,
    public media: DeviceSizeService,
    public dialog: MatDialog,
    public d: DicoService
  ) { }

  ngOnInit() {
    this.usersWatcher = this.watchUsers();
  }

  ngOnDestroy() {
    this.usersWatcher.unsubscribe();
  }

  watchUsers() {
    return this.cafet.getTrezAccounts().subscribe(users => {
      this.users = users;
      this.controls = {};
      this.expanded = {};
      for (let user of users) {
        this.controls[user.emailId] = {
          add: new FormControl("", [Validators.required, Validators.max(1000), Validators.min(0.1)]),
          sub: new FormControl("", [Validators.required, Validators.max(1000), Validators.min(0.1)])
        };
        this.expanded[user.emailId] = false;
      }
    })
  }


  // transactions

  transaction(user: CafetUser, add: boolean) {
    let value;
    if (add){
      value = this.controls[user.emailId].add.value;
    } else {
      value = -this.controls[user.emailId].sub.value;
    }
    this.controls[user.emailId].add.setValue("");
    this.controls[user.emailId].sub.setValue("");
    this.cafet.newTrezoTransaction(user, value).then(
      () => {
        this.error = this.d.format(this.d.l.informAboutTransaction, this.cafet.getUserName(user), value.toFixed(2));
      },
      (err) => {
        this.error = err;
      }
    );
  }

  openHistory(user: CafetUser): void {
    let dialogRef = this.dialog.open(CafetHistoryComponent, {
      data: user,
      width: '450px'
    });
  }
}
