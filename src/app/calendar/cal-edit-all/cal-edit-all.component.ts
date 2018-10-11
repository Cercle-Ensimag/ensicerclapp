import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DicoService} from '../../language/dico.service';
import {CalService} from '../cal-service/cal.service';
import {DeleteDialogComponent} from '../../shared-components/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-cal-edit-all',
  templateUrl: './cal-edit-all.component.html',
  styleUrls: ['./cal-edit-all.component.css']
})
export class CalEditAllComponent implements OnInit {

  constructor(
    public d: DicoService,
    public cal: CalService,
    public location: Location,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
	) { }

  ngOnInit() {
  }

  removePersoEvent(event) {
    this.dialog.open(DeleteDialogComponent, {
      data: {
        title: "Confirmation de la suppression",
        content: `Êtes-vous certain de vouloir supprimer "${event.title}" ?`
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.cal.removeEvent(event.id).then(() =>
          this.snackBar.open("Evénement supprimé", 'ok', {duration: 2000})
        )
      }
    });

  }

}
