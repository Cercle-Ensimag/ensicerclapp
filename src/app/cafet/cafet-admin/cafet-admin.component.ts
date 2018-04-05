import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ListService } from '../../providers/list.service';
import { CafetService, CafetUser } from '../cafet-service/cafet.service';
import { ToolsService } from '../../providers/tools.service';
import { DeviceSizeService } from '../../providers/device-size.service';
import { DicoService } from '../../language/dico.service';


@Component({
  selector: 'app-cafet-admin',
  templateUrl: './cafet-admin.component.html',
  styleUrls: ['./cafet-admin.component.css']
})
export class CafetAdminComponent implements OnInit, OnDestroy {

  users: CafetUser[];
  matchUsers: CafetUser[] = [];

  accountCtrl: FormGroup;
  accountWatcher1: any;
  accountWatcher2: any;

  usersWatcher: any;

  error: string;
  exte: boolean;

  constructor(
    private list: ListService,
    public cafet: CafetService,
    public tools: ToolsService,
    public media: DeviceSizeService,
    private fb: FormBuilder,
    public d: DicoService
  ) { }

  ngOnInit() {
    this.createAccountForm();
    this.usersWatcher = this.watchUsers();
    this.list.start();
  }

  ngOnDestroy() {
    this.usersWatcher.unsubscribe();
    this.list.stop();
  }

  watchUsers() {
    return this.cafet.getUsers().subscribe(users => {
      this.users = users;
      this.findMatchUsers(this.getAccountEmail());
    })
  }

  // Accounts

  tryCreateCafetAccount() {
    let emailId = this.tools.getEmailIdFromEmail(this.getAccountEmail());
    let name = this.tools.titleCase(emailId.replace('|', ' ').replace('  ', ' '));

    if (this.list.authUsers[emailId] !== this.getAccountEmail().toLowerCase()) {
      this.error = this.d.format(this.d.l.notOnTheList, name);
      this.exte = true;
    } else {
      this.createCafetAccount(false);
    }
  }

  createCafetAccount(exte: boolean) {
    let user = {
      credit: 0,
      activated: true,
      emailId: (exte ? "%exte%": "") +  this.tools.getEmailIdFromEmail(this.getAccountEmail()),
      creationDate: (new Date()).getTime(),
      lastTransactionDate: (new Date()).getTime(),
      profile: {
        firstName: this.tools.titleCase(this.getAccountFirstname()),
        lastName: this.tools.titleCase(this.getAccountLastName()),
        email: this.getAccountEmail(),
        exte: exte
      }
    };
    this.cafet.setUserAccount(user).then(
      () => {
        this.cafet.newTransaction(user, this.getAccountCredit()).then(
          () => {
            let value = this.getAccountCredit();
            this.clearAccountCreation()
            this.error = this.d.format(this.d.l.informAboutCafetCreation, this.cafet.getUserName(user), value.toFixed(2));
          },
          (err) => {
            this.error = err;
          }
        );
      },
      (err) => {
        this.error = err;
      }
    );
  }

  clearAccountCreation() {
    this.accountCtrl.reset({
      firstName: '',
      lastName: '',
      email: '',
      credit: 0
    });
    this.exte = false;
  }

  createAccountForm() {
    this.accountCtrl = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.email]],
      credit: [0, []]
    });
    if (this.accountWatcher1) {
      this.accountWatcher1.unsubscribe();
    }
    this.accountWatcher1 = this.accountCtrl.get('email').valueChanges.subscribe((email) => {
      this.findMatchUsers(email);
    });
    if (this.accountWatcher2) {
      this.accountWatcher2.unsubscribe();
    }
    this.accountWatcher2 = this.accountCtrl.valueChanges.subscribe(() => {
      this.error = null;
    });
  }

  getAccountFirstname() {
    return this.accountCtrl.get('firstName').value;
  }

  getAccountLastName() {
    return this.accountCtrl.get('lastName').value;
  }

  getAccountEmail() {
    return this.accountCtrl.get('email').value;
  }

  getAccountCredit() {
    return this.accountCtrl.get('credit').value;
  }

  findMatchUsers(email: string) {
    let emailId = this.tools.getEmailIdFromEmail(email);
    this.matchUsers = this.users.filter(
      user => user.emailId.includes(emailId)
    );
  }

}
