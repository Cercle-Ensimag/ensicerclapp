
import {first, map} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

import {DeviceSizeService} from '../../providers/device-size.service';
import {ActusService} from '../actus-service/actus.service';
import {AuthService} from '../../auth/auth-service/auth.service';
import {ListService} from '../../providers/list.service';
import {ToolsService} from '../../providers/tools.service';
import {DicoService} from '../../language/dico.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Subject, Observable} from 'rxjs';
import {Location} from '@angular/common';

export class Journalist {
  emailId: string;
  groupId: string;
}

export class Group {
  groupId: string;
  displayName: string;
}

@Component({
  selector: 'app-actu-admin',
  templateUrl: './actu-admin.component.html',
  styleUrls: ['./actu-admin.component.css']
})
export class ActuAdminComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  public emailCtrl: FormControl;

  constructor(
    private auth: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,

    public tools: ToolsService,
    public actus: ActusService,
    public media: DeviceSizeService,
    public list: ListService,
    public d: DicoService,
    public location: Location
  ) {}

  ngOnInit () {
    this.emailCtrl = new FormControl('', [this.auth.emailDomainValidator, Validators.email]);
  }

  ngOnDestroy () {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  filteredUsers(): Observable<Journalist[]> {
    let emailId = this.tools.getEmailIdFromEmail(this.emailCtrl.value.split('@')[0]);
    return this.actus.getJournalists().pipe(
      map(journalists => journalists.filter(
        user => user.emailId.includes(emailId)
      )));
  }

  addJournalist() {
    const emailId = this.tools.getEmailIdFromEmail(this.emailCtrl.value);
    this.list.isInList(this.emailCtrl.value).pipe(
      first())
      .subscribe(inList => {
        if (!inList) {
          let name = this.tools.getNameFromEmailId(emailId);
          this.snackBar.open(this.d.format(this.d.l.notOnTheList, name), this.d.l.okLabel, {duration: 2000});
        } else {
          this.actus.addJournalist(this.emailCtrl.value, {
            groupId: emailId,
            displayName: emailId
          });
          this.emailCtrl.setValue('');
        }
      });
  }

  /*add(emailId: string){
    this.actus.addJournalist(emailId.split('|').join('.') + 'ensimag.fr', {
      groupId: emailId,
      displayName: emailId
    });
  }*/

}
