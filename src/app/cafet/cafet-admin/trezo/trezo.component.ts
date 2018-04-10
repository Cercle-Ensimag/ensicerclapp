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

  trezo: CafetUser[];
  users: CafetUser[];
  displayedUsers: CafetUser[] = [];
  usersWatcher: any;
  trezoWatcher: any;

  controls: {[emailId: string]: {
    add: FormControl,
    sub: FormControl
  }};

  expanded: {[emailId: string]: boolean};

  totalOfPositive = 0;
  totalOfNegative = 0;
  totalOnAccounts = 0;
  nbOfPosAccounts = 0;
  nbOfNegAccounts = 0;
  nbOfAllAccounts = 0;

  error: string;

  constructor(
    public cafet: CafetService,
    public tools: ToolsService,
    public media: DeviceSizeService,
    public dialog: MatDialog,
    public d: DicoService
  ) { }

  ngOnInit() {
    this.trezoWatcher = this.watchTrezo();
    this.usersWatcher = this.watchUsers();
  }

  ngOnDestroy() {
    this.trezoWatcher.unsubscribe();
    this.usersWatcher.unsubscribe();
  }

  watchTrezo() {
    return this.cafet.getTrezAccounts().subscribe(trezo => {
      this.trezo = trezo;
      this.controls = {};
      this.expanded = {};
      for (let user of trezo) {
        this.controls[user.emailId] = {
          add: new FormControl("", [Validators.required, Validators.max(1000), Validators.min(0.1)]),
          sub: new FormControl("", [Validators.required, Validators.max(1000), Validators.min(0.1)])
        };
        this.expanded[user.emailId] = false;
      }
    })
  }

  watchUsers() {
    return this.cafet.getUsers().subscribe(users => {
        this.processAccounts(users);
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


  // Credits

  processAccounts(users: CafetUser[]) {
    this.totalOfPositive = 0;
    this.totalOfNegative = 0;
    this.totalOnAccounts = 0;
    this.nbOfPosAccounts = 0;
    this.nbOfNegAccounts = 0;
    this.nbOfAllAccounts = 0;
    users.forEach(user => {
      if (user.credit < 0) {
        this.totalOfNegative += user.credit;
        this.nbOfNegAccounts += 1;
      } else {
        this.totalOfPositive += user.credit;
        this.nbOfPosAccounts += 1;
      }
      this.totalOnAccounts += user.credit;
      this.nbOfAllAccounts += 1;
    })
  }
}
