import { Component, Inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatTableDataSource } from '@angular/material';

import { CafetService, CafetUser, Transaction } from '../cafet-service/cafet.service';
import { DicoService } from '../../language/dico.service';

class Element {
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
  history: MatTableDataSource<Element> = new MatTableDataSource<Element>([]);
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

  ngAfterViewInit() {
    this.history.paginator = this.paginator;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  watchHistory() {
    return this.cafet.getHistory(this.user).subscribe(
      history => {
        let elements: Element[] = [];
        history.reverse().forEach(trans => {
          elements.push({
            date: trans.date,
            value: trans.value.toFixed(2) + '€'
          })
        })
        elements.push({
          date: this.user.creationDate,
          value: 'Création'
        })
        this.history.data = elements;
        this.isHistory = true;
      }
    )
  }

  isPlus(element: Element) {
    return element.value.match(/^[0-9]/);
  }

  isMinus(element: Element) {
    return element.value.match(/^-/);
  }
}
