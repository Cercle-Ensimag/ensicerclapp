import {Component, Input, OnInit} from '@angular/core';
import {CalService} from '../../cal-service/cal.service';
import {DicoService} from '../../../language/dico.service';
import {DeviceSizeService} from '../../../providers/device-size.service';
import {DeleteDialogComponent} from '../../../shared-components/delete-dialog/delete-dialog.component';
import {MatDialog, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-day-column',
  templateUrl: './day-column.component.html',
  styleUrls: ['./day-column.component.css']
})
export class DayColumnComponent implements OnInit {
  @Input() date: Date = new Date();
  @Input() editing: boolean = false;

  constructor(
    private media: DeviceSizeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,

    public cal: CalService,
    public d: DicoService
  ) { }

  ngOnInit() { }

  removeEvent(event) {
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
