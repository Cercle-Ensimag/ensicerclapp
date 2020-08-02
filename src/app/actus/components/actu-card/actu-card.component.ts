import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDialogComponent } from '../../../shared-components/delete-dialog/delete-dialog.component';
import { Actu, ActusService } from '../../actus-service/actus.service';
import { DicoService } from '../../../language/dico.service';
import { Tools } from '../../../providers/tools.service';
import { Observable } from 'rxjs';

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

		public d: DicoService
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
					this.snackBar.open(this.d.l.deletedActuInfo, this.d.l.ok, {duration: 2000})
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

	getDescriptionPreview(actu: Actu): string {
		return Tools.truncate(actu.description);
	}
}
