import { Component, OnInit} from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { CafetService, CafetUser } from '../../cafet-service/cafet.service';
import { ToolsService } from '../../../providers/tools.service';
import { DeviceSizeService } from '../../../providers/device-size.service';
import { DicoService } from '../../../language/dico.service';

import { CafetHistoryComponent } from '../../cafet-history/cafet-history.component';
import { EditCafetUserComponent } from '../edit-cafet-user/edit-cafet-user.component';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-cafet-admin-archives',
  templateUrl: './cafet-admin-archives.component.html',
  styleUrls: ['./cafet-admin-archives.component.css']
})
export class CafetAdminArchivesComponent implements OnInit {
  public emailCtrl: FormControl;

  constructor(
    public cafet: CafetService,
    public tools: ToolsService,
    public media: DeviceSizeService,
    public dialog: MatDialog,
    public d: DicoService
  ) { }

  ngOnInit() {
    this.emailCtrl = new FormControl('', [Validators.email]);
  }

  filteredUsers(): Observable<CafetUser[]> {
    let emailId = this.tools.getEmailIdFromEmail(this.emailCtrl.value.split('@')[0]);
    return this.cafet.getArchivesUsers()
      .map(users => users.filter(
        user => user.emailId.includes(emailId)
      ));
  }

  openHistory(user: CafetUser): void {
    this.dialog.open(CafetHistoryComponent, {
      data: {user: user, day: false},
      width: '450px'
    });
  }

  openEditor(user: CafetUser): void {
    this.dialog.open(EditCafetUserComponent, {
      data: user,
      width: '450px'
    });
  }


}
