import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from '../../auth/auth-service/auth.service';
import {Actu, ActusService} from '../actus-service/actus.service';
import { DicoService } from '../../language/dico.service';
import {DeleteDialogComponent} from '../../shared-components/delete-dialog/delete-dialog.component';
import {MatDialog, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-journalist',
  templateUrl: './journalist.component.html',
  styleUrls: ['./journalist.component.css']
})
export class JournalistComponent implements OnInit, OnDestroy {

  pageIndex: number = 0;
  pageSize: number = 5;

  constructor(
    public auth: AuthService,
    public actus: ActusService,
    public d: DicoService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit () {
    this.actus.start();
  }

  ngOnDestroy () {
    this.actus.stop();
  }

}
