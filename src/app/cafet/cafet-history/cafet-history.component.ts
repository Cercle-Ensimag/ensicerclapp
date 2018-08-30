import { Component, Inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatTableDataSource } from '@angular/material';

import { CafetService, CafetUser, Transaction } from '../cafet-service/cafet.service';
import { DicoService } from '../../language/dico.service';

class Log {
  date: number;
  value: string;
}

@Component({
  selector: 'app-cafet-history',
  templateUrl: './cafet-history.component.html',
  styleUrls: ['./cafet-history.component.css']
})
export class CafetHistoryComponent {

  isHistory: boolean;
  history: MatTableDataSource<Log> = new MatTableDataSource<Log>([]);
  historyWatcher: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

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
    return this.cafet.getHistory(this.user.emailId).subscribe(
      history => {
        const logs: Log[] = [];
        history.reverse().forEach(trans => {
          logs.push({
            date: trans.date,
            value: trans.value.toFixed(2) + '€'
          })
        });
        logs.push({
          date: this.user.creationDate,
          value: this.d.l.cafetAccountCreationDateLabel
        });
        this.history.data = logs;
        setTimeout(() => this.history.paginator = this.paginator);
        this.isHistory = true;
      }
    )
  }

  isPlus(log: Log) {
    return log.value.match(/^[0-9]/);
  }

  isMinus(log: Log) {
    return log.value.match(/^-/);
  }
}
