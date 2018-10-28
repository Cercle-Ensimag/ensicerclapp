import {Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DeleteDialogComponent} from '../../../shared-components/delete-dialog/delete-dialog.component';
import {Actu, ActusService} from '../../actus-service/actus.service';
import {DicoService} from '../../../language/dico.service';
import {ToolsService} from '../../../providers/tools.service';
import {Observable} from 'rxjs';

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
        title: this.d.l.deleteActuDialogTitle,
        content: this.d.format(this.d.l.deleteActuDialogContent, this.actu.title)
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.actus.deleteActu(this.actu.id).then(() =>
          this.snackBar.open(this.d.l.deletedActuInfo, this.d.l.okLabel, {duration: 2000})
        );
      }
    });
  }

	getGroupName(groupId: string): Observable<string> {
		return this.actus.getGroupName(groupId);
	}

	getActuGroupIds(actu: Actu): string[] {
		return this.actus.getActuGroupIds(actu);
	}
}
