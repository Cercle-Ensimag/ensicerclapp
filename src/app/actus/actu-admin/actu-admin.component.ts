import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { DeviceSizeService } from '../../providers/device-size.service';
import {Actu, ActusService} from '../actus-service/actus.service';
import { AuthService } from '../../auth/auth-service/auth.service';
import { ListService } from '../../providers/list.service';
import { ToolsService } from '../../providers/tools.service';
import { DicoService } from '../../language/dico.service';
import {DeleteDialogComponent} from '../../shared-components/delete-dialog/delete-dialog.component';
import {MatDialog, MatSnackBar} from '@angular/material';

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

  emailCtrl: FormControl;
  emailWatcher: any;

  journalists: Journalist[];
  displayedUsers: Journalist[];
  journalistsWatcher: any;

  error: string;

  pageIndex: number = 0;
  pageSize: number = 5;

  constructor(
    private auth: AuthService,
    public tools: ToolsService,
    public actus: ActusService,
    public media: DeviceSizeService,
    private list: ListService,
    public d: DicoService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit () {
    this.actus.start();
    this.journalistsWatcher = this.actus.getJournalists().subscribe(journalist => {
      this.journalists = journalist;
      this.sortUsers(this.emailCtrl.value);
    });
    this.createSearchForm();
    this.list.start();
  }

  ngOnDestroy () {
    this.actus.stop();
    this.journalistsWatcher.unsubscribe();
    this.list.stop();
  }

  delete(actu: Actu) {
    this.dialog.open(DeleteDialogComponent, {
      data: {
        title: "Confirmation de la suppression",
        content: `Êtes-vous certain de vouloir supprimer ${actu.title} ?`
      }
    }).afterClosed().subscribe(result => {
      if (result){
        this.actus.deleteActu(actu.id);
        this.snackBar.open("Actu supprimée", 'ok', {duration: 2000});
      }
    });
  }

  createSearchForm() {
    this.emailCtrl = new FormControl('', [this.auth.emailDomainValidator, Validators.email]);
    this.emailCtrl.valueChanges.subscribe((email) => {
      this.sortUsers(email);
      this.error = null;
    });
  }

  sortUsers(email: string) {
    let emailId = this.tools.getEmailIdFromEmail(email.split('@')[0]);
    this.displayedUsers = this.journalists.filter(
      user => user.emailId.includes(emailId)
    );
  }

  updateList(event) {
    this.pageIndex = event.pageIndex;
  }

  addJournalist() {
    if (!this.emailCtrl.invalid && this.displayedUsers.length == 0) {
      let emailId = this.tools.getEmailIdFromEmail(this.emailCtrl.value);
      if (!this.list.authUsers[emailId]) {
        let name = this.tools.titleCase(emailId.replace('|', ' ').replace('  ', ' '));
        this.error = this.d.format(this.d.l.notOnTheList, name);
      } else {
        this.actus.addJournalist(this.emailCtrl.value, {
          groupId: emailId,
          displayName: emailId
        });
        this.emailCtrl.setValue("");
      }
    }
  }

}
