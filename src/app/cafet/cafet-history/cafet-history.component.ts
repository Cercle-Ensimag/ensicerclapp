import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { CafetService, CafetUser, Transaction } from '../cafet-service/cafet.service';
import { DicoService } from '../../language/dico.service';

@Component({
  selector: 'app-cafet-history',
  templateUrl: './cafet-history.component.html',
  styleUrls: ['./cafet-history.component.css']
})
export class CafetHistoryComponent {

  history: Transaction[];
  historyWatcher: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public user: CafetUser,
    public dialogRef: MatDialogRef<CafetHistoryComponent>,
    public cafet: CafetService,
    public d: DicoService
  ) { }

  ngOnInit() {
    if (this.historyWatcher) {
      this.historyWatcher.unsubscribe();
    }
    this.historyWatcher = this.watchHistory();
  }

  ngOnDestroy() {
    if (this.historyWatcher) {
      this.historyWatcher.unsubscribe();
      this.historyWatcher = null;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  watchHistory() {
    return this.cafet.getHistory(this.user).subscribe(
      history => {
        this.history = history.reverse() || [];
      }
    )
  }
}
