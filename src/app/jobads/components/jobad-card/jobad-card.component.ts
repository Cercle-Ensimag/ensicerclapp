import { Component, Input, OnInit } from '@angular/core';
import { JobAd, JobAdsService } from '../../jobads.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDialogComponent } from '../../../shared-components/delete-dialog/delete-dialog.component';
import { Tools } from '../../../providers/tools.service';
import { DicoService } from '../../../language/dico.service';

@Component({
	selector: 'app-jobad-card',
	templateUrl: './jobad-card.component.html',
	styleUrls: ['./jobad-card.component.css']
})
export class JobAdCardComponent implements OnInit {
	@Input() admin: boolean = false;
	@Input() jobad: JobAd;

	constructor(
		private jobads: JobAdsService,
		private dialog: MatDialog,
		private snackBar: MatSnackBar,

		public d: DicoService
	) { }

	ngOnInit() { }

	delete() {
		this.dialog.open(DeleteDialogComponent, {
			data: {
				title: this.d.l.deleteJobAdsDialogTitle,
				content: this.d.format(this.d.l.deleteJobAdsDialogContent, this.jobad.title)
			}
		}).afterClosed().subscribe(result => {
			if (result) {
				this.jobads.deleteJobAd(this.jobad.id).then(
					() => this.snackBar.open(this.d.l.deletedJobAdsInfo, this.d.l.ok, {duration: 2000})
				);
			}
		});
	}

	getDescriptionPreview(jobad: JobAd): string {
		return Tools.truncate(jobad.description);
	}
}
