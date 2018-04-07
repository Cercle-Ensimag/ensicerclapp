import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatTableDataSource } from '@angular/material';

import { CafetService, CafetUser, Transaction } from '../../cafet-service/cafet.service';
import { DicoService } from '../../../language/dico.service';

class Element {
  date: number;
  value: string;
}

@Component({
  selector: 'app-cafet-day-history',
  templateUrl: './cafet-day-history.component.html',
  styleUrls: ['./cafet-day-history.component.css']
})
export class CafetDayHistoryComponent implements OnInit {

  history: MatTableDataSource<Element> = new MatTableDataSource<Element>([]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public dayTr: any,
    public dialogRef: MatDialogRef<CafetDayHistoryComponent>,
    public cafet: CafetService,
    public d: DicoService
  ) { }

  ngOnInit() {
    if (this.dayTr) {
      let elements: Element[] = [];
      Object.getOwnPropertyNames(this.dayTr).reverse().forEach(transId => {
        elements.push({
          date: this.dayTr[transId].date,
          value: this.dayTr[transId].value.toFixed(2) + '€'
        });
      });
      this.history.data = elements;
      this.isHistory = true;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isPlus(element: Element) {
    return element.value.match(/^[0-9]/);
  }

  isMinus(element: Element) {
    return element.value.match(/^-/);
  }

}
