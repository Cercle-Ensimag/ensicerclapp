import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-cafet-history',
  templateUrl: './cafet-history.component.html',
  styleUrls: ['./cafet-history.component.css']
})
export class CafetHistoryComponent {

  constructor(
    public dialogRef: MatDialogRef<CafetHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public user: any
  ) { }

  ngOnInit() {
    console.log(this.user.emailId);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
