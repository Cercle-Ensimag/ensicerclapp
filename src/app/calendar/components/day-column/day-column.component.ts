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

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,

    public media: DeviceSizeService,
    public cal: CalService,
    public d: DicoService
  ) { }

  ngOnInit() { }

}
