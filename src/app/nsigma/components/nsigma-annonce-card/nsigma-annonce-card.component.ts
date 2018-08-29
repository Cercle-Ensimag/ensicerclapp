import {Component, Input, OnInit} from '@angular/core';
import {NsigmaAnnonce, NsigmaService} from '../../nsigma.service';
import {DeleteDialogComponent} from '../../../shared-components/delete-dialog/delete-dialog.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ToolsService} from '../../../providers/tools.service';

@Component({
  selector: 'app-nsigma-annonce-card',
  templateUrl: './nsigma-annonce-card.component.html',
  styleUrls: ['./nsigma-annonce-card.component.css']
})
export class NsigmaAnnonceCardComponent implements OnInit {

  @Input() admin: boolean = false;
  @Input() annonce: NsigmaAnnonce;

  constructor(
    public nsigma: NsigmaService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private tools: ToolsService,
  ) { }

  ngOnInit() {
  }

  delete() {
    this.dialog.open(DeleteDialogComponent, {
      data: {
        title: "Confirmation de la suppression",
        content: `Êtes-vous certain de vouloir supprimer "${this.annonce.title}" ?`
      }
    }).afterClosed().subscribe(result => {
      if (result){
        this.nsigma.deleteNsigmaAnnonce(this.annonce.id);
        this.snackBar.open("Annonce supprimée", 'ok', {duration: 2000});
      }
    });
  }
}
