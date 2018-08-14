import {Component, OnDestroy, OnInit} from '@angular/core';
import {NsigmaService} from '../nsigma.service';
import {DicoService} from '../../language/dico.service';
import {ToolsService} from '../../providers/tools.service';
import {MatDialog} from '@angular/material';
import {DeleteDialogComponent} from '../../shared-components/delete-dialog/delete-dialog.component';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-nsigma-admin',
  templateUrl: './nsigma-admin.component.html',
  styleUrls: ['./nsigma-admin.component.css']
})
export class NsigmaAdminComponent implements OnInit, OnDestroy {

  pageIndex: number = 0;
  pageSize: number = 10;

  constructor(
    public nsigma: NsigmaService,
    public d: DicoService,
    private tools: ToolsService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  delete(nsigmaAnnonceId: number, nsigmaAnnonceTitle: string) {
    this.dialog.open(DeleteDialogComponent, {
      data: {
        title: "Confirmation de la suppression",
        content: `Êtes-vous certain de vouloir supprimer ${nsigmaAnnonceTitle} ?`
      }
    }).afterClosed().subscribe(result => {
      if (result){
        this.nsigma.deleteNsigmaAnnonce(nsigmaAnnonceId);
        this.snackBar.open("Annonce supprimée", 'ok', {duration: 2000});
      }
    });
  }

  updateList(event) {
    this.pageIndex = event.pageIndex;
  }

  ngOnInit() {
    this.nsigma.start();
  }

  ngOnDestroy() {
    this.nsigma.stop();
  }

}
