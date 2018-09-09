import {Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DeleteDialogComponent} from '../../../shared-components/delete-dialog/delete-dialog.component';
import {Actu, ActusService} from '../../actus-service/actus.service';
import {DicoService} from '../../../language/dico.service';
import {ToolsService} from '../../../providers/tools.service';

@Component({
  selector: 'app-actu-card',
  templateUrl: './actu-card.component.html',
  styleUrls: ['./actu-card.component.css']
})
export class ActuCardComponent implements OnInit {

  @Input() admin: boolean = false;
  @Input() actu: Actu;

  constructor(
    private actus: ActusService,
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
        content: `Êtes-vous certain de vouloir supprimer "${this.actu.title}" ?`
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.actus.deleteActu(this.actu.id).then(() =>
          this.snackBar.open("Actualité supprimée", 'ok', {duration: 2000})
        );
      }
    });
  }
}
