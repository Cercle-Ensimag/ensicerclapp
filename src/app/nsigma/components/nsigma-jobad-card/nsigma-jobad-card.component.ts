import {Component, Input, OnInit} from '@angular/core';
import {DicoService} from '../../../language/dico.service';
import {NsigmaJobAd, NsigmaService} from '../../nsigma.service';
import {DeleteDialogComponent} from '../../../shared-components/delete-dialog/delete-dialog.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Tools} from '../../../providers/tools.service';

@Component({
	selector: 'app-nsigma-jobad-card',
	templateUrl: './nsigma-jobad-card.component.html',
	styleUrls: ['./nsigma-jobad-card.component.css']
})
export class NsigmaJobAdCardComponent implements OnInit {

	@Input() admin: boolean = false;
	@Input() jobad: NsigmaJobAd;

	constructor(
		private nsigma: NsigmaService,
		private dialog: MatDialog,
		private snackBar: MatSnackBar,

		public d: DicoService
	) { }

	ngOnInit() { }

	delete() {
		this.dialog.open(DeleteDialogComponent, {
			data: {
				title: this.d.l.deleteNsigmaJobAdsDialogTitle,
				content: this.d.format(this.d.l.deleteNsigmaJobAdsDialogContent, this.jobad.title)
			}
		}).afterClosed().subscribe(result => {
			if (result){
				this.nsigma.deleteJobAd(this.jobad.id).then(() =>
					this.snackBar.open(this.d.l.deletedNsigmaJobAdsInfo, this.d.l.okLabel, {duration: 2000})
				);
			}
		});
	}

	getDescriptionPreview(jobad: NsigmaJobAd): string {
		return Tools.truncate(jobad.description);
	}
}
