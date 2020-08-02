import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { CafetService, CafetUser } from '../../cafet-service/cafet.service';
import { Tools } from '../../../providers/tools.service';
import { DeviceSizeService } from '../../../providers/device-size.service';
import { DicoService } from '../../../language/dico.service';

import { CafetHistoryComponent } from '../../cafet-history/cafet-history.component';
import { EditCafetUserComponent } from '../edit-cafet-user/edit-cafet-user.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
	selector: 'app-cafet-admin-archives',
	templateUrl: './cafet-admin-archives.component.html',
	styleUrls: ['./cafet-admin-archives.component.css']
})
export class CafetAdminArchivesComponent implements OnInit {
	public emailCtrl: FormControl;
	private usersObs: Observable<CafetUser[]>;
	private hasChanged: boolean = false;

	constructor(
		public cafet: CafetService,
		public media: DeviceSizeService,
		public dialog: MatDialog,
		public d: DicoService
	) { }

	ngOnInit() {
		this.emailCtrl = new FormControl('', [Validators.email]);
		this.emailCtrl.valueChanges.subscribe(() => this.hasChanged = true);
	}

	getUsers(): Observable<CafetUser[]> {
		if (!this.usersObs || this.hasChanged) {
			this.usersObs = this.cafet.getArchivesUsers().pipe(map(
				users => {
					const emailId = Tools.getEmailIdFromEmail(this.emailCtrl.value);
					return users.filter(user => user.emailId.includes(emailId))
				}
			));
			this.hasChanged = false;
		}
		return this.usersObs;
	}

	openHistory(user: CafetUser): void {
		this.dialog.open(CafetHistoryComponent, {
			data: {user: user, day: false},
			width: '450px'
		});
	}

	openEditor(user: CafetUser): void {
		this.dialog.open(EditCafetUserComponent, {
			data: user,
			width: '450px'
		});
	}


}
