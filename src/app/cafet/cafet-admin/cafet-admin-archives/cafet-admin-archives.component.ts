import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { CafetService, CafetUser } from '../../cafet-service/cafet.service';
import { ToolsService } from '../../../providers/tools.service';
import { DeviceSizeService } from '../../../providers/device-size.service';
import { DicoService } from '../../../language/dico.service';

import { CafetHistoryComponent } from '../../cafet-history/cafet-history.component';
import { EditCafetUserComponent } from '../../edit-cafet-user/edit-cafet-user.component';

@Component({
  selector: 'app-cafet-admin-archives',
  templateUrl: './cafet-admin-archives.component.html',
  styleUrls: ['./cafet-admin-archives.component.css']
})
export class CafetAdminArchivesComponent implements OnInit {

  users: CafetUser[];
  displayedUsers: CafetUser[] = [];
  usersWatcher: any;

  searchCtrl: FormGroup;
  searchWatcher1: any;
  searchWatcher2: any;

  pageIndex: number = 0;
  pageSize: number = 20;
  error: string;

  constructor(
    public cafet: CafetService,
    public tools: ToolsService,
    public media: DeviceSizeService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public d: DicoService
  ) { }

  ngOnInit() {
    this.createSearchForm();
    this.usersWatcher = this.watchUsers();
  }

  ngOnDestroy() {
    this.usersWatcher.unsubscribe();
  }

  watchUsers() {
    return this.cafet.getArchivesUsers().subscribe(users => {
      this.users = users;
      this.sortUsers(this.getSearchEmail());
    })
  }

  createSearchForm() {
    this.searchCtrl = this.fb.group({
      email: ['', [Validators.email]]
    });
    if (this.searchWatcher1) {
      this.searchWatcher1.unsubscribe();
    }
    this.searchWatcher1 = this.searchCtrl.get('email').valueChanges.subscribe((email) => {
      this.sortUsers(email);
    });
    if (this.searchWatcher2) {
      this.searchWatcher2.unsubscribe();
    }
    this.searchWatcher1 = this.searchCtrl.valueChanges.subscribe(() => {
      this.error = null;
    });
  }

  getSearchEmail() {
    return this.searchCtrl.get('email').value;
  }

  sortUsers(email: string) {
    let emailId = this.tools.getEmailIdFromEmail(email);
    this.pageIndex = 0;
    this.displayedUsers = this.users.filter(
      user => user.emailId.includes(emailId)
    );
  }

  updateList(event) {
    this.pageIndex = event.pageIndex;
  }

  openHistory(user: CafetUser): void {
    let dialogRef = this.dialog.open(CafetHistoryComponent, {
      data: user,
      width: '450px'
    });
  }

  openEditor(user: CafetUser): void {
    let dialogRef = this.dialog.open(EditCafetUserComponent, {
      data: user,
      width: '450px'
    });
  }


}
