import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialog, MatSnackBar} from '@angular/material';

import {CafetService, CafetUser} from '../../cafet-service/cafet.service';
import {ToolsService} from '../../../providers/tools.service';
import {DeviceSizeService} from '../../../providers/device-size.service';
import {DicoService} from '../../../language/dico.service';

import {CafetHistoryComponent} from '../../cafet-history/cafet-history.component';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-trezo',
  templateUrl: './trezo.component.html',
  styleUrls: ['./trezo.component.css']
})
export class TrezoComponent implements OnInit {
  private unsubscribe: Subject<void> = new Subject();

  public controls: {[emailId: string]: {
    add: FormControl,
    sub: FormControl
  }};

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,

    public cafet: CafetService,
    public tools: ToolsService,
    public media: DeviceSizeService,
    public d: DicoService,
  ) { }

  ngOnInit() {
    this.initFormGroup();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initFormGroup() {
    this.cafet.getTrezAccounts()
      .takeUntil(this.unsubscribe)
      .subscribe(users => {
        this.controls = {};
        for (let user of users) {
          this.controls[user.emailId] = {
            add: new FormControl('', [Validators.required, Validators.max(1000), Validators.min(0.1)]),
            sub: new FormControl('', [Validators.required, Validators.max(1000), Validators.min(0.1)])
          };
        }
      });
  }

  // transactions

  transaction(user: CafetUser, add: boolean) {
    let value;
    if (add){
      value = this.controls[user.emailId].add.value;
    } else {
      value = -this.controls[user.emailId].sub.value;
    }
    this.cafet.newTrezoTransaction(user, value)
      .then(() => {
        this.controls[user.emailId].add.setValue('');
        this.controls[user.emailId].sub.setValue('');
        this.snackBar.open(this.d.format(this.d.l.informAboutTransaction, this.cafet.getUserName(user), value.toFixed(2)), 'ok', {duration: 2000});
      })
      .catch((err) => this.snackBar.open(err, 'ok', {duration: 2000}));
  }

  openHistory(user: CafetUser): void {
    this.dialog.open(CafetHistoryComponent, {
      data: {user: user, day: false},
      width: '450px'
    });
  }


  // Credits
  get totalOfPositive(): Observable<string> {
    return this.cafet.getUsers()
      .map(users => users.filter(user => user.credit >= 0).reduce((sum, user) => sum + user.credit, 0).toFixed(2))
  }

  get totalOfNegative(): Observable<string> {
    return this.cafet.getUsers()
      .map(users => users.filter(user => user.credit < 0).reduce((sum, user) => sum + user.credit, 0).toFixed(2))
  }

  get totalOnAccounts(): Observable<string> {
    return this.cafet.getUsers()
      .map(users => users.reduce((sum, user) => sum + user.credit, 0).toFixed(2))
  }

  get nbOfPosAccounts(): Observable<number> {
    return this.cafet.getUsers()
      .map(users => users.filter(user => user.credit >= 0).length)
  }

  get nbOfNegAccounts(): Observable<number> {
    return this.cafet.getUsers()
      .map(users => users.filter(user => user.credit < 0).length)
  }

  get nbOfAllAccounts(): Observable<number> {
    return this.cafet.getUsers()
      .map(users => users.length)
  }
}
