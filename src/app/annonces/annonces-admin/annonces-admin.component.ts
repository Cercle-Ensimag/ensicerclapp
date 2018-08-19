import {Component, OnDestroy, OnInit} from '@angular/core';
import {Annonce, AnnoncesService} from '../annonces.service';
import {DicoService} from '../../language/dico.service';
import {ToolsService} from '../../providers/tools.service';
import {MatDialog} from '@angular/material';
import {DeleteDialogComponent} from '../../shared-components/delete-dialog/delete-dialog.component';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-annonces-admin',
  templateUrl: './annonces-admin.component.html',
  styleUrls: ['./annonces-admin.component.css']
})
export class AnnoncesAdminComponent implements OnInit, OnDestroy {

  constructor(
    public annonces: AnnoncesService,
    public d: DicoService,
    private tools: ToolsService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.annonces.start();
  }

  ngOnDestroy() {
    this.annonces.stop();
  }

}
