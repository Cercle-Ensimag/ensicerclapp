import {Component, Input, OnInit} from '@angular/core';
import {Annonce, AnnoncesService} from '../../annonces.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DeleteDialogComponent} from '../../../shared-components/delete-dialog/delete-dialog.component';
import {ToolsService} from '../../../providers/tools.service';
import {DicoService} from '../../../language/dico.service';

@Component({
  selector: 'app-annonce-card',
  templateUrl: './annonce-card.component.html',
  styleUrls: ['./annonce-card.component.css']
})
export class AnnonceCardComponent implements OnInit {
  @Input() admin: boolean = false;
  @Input() annonce: Annonce;

  constructor(
    private annonces: AnnoncesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,

    public d: DicoService,
    public tools: ToolsService
  ) { }

  ngOnInit() { }

  delete() {
    this.dialog.open(DeleteDialogComponent, {
      data: {
        title: "Confirmation de la suppression",
        content: `Êtes-vous certain de vouloir supprimer "${this.annonce.title}" ?`
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.annonces.deleteAnnonce(this.annonce.id).then(() =>
          this.snackBar.open("Annonce supprimée", 'ok', {duration: 2000})
        );
      }
    });
  }
}
