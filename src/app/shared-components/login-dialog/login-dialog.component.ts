import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { DicoService } from "../../language/dico.service";

@Component({
	selector: 'app-login-dialog',
	templateUrl: './login-dialog.component.html',
	styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {
	public hidePwd: boolean = true;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public d: DicoService
	) {}

	ngOnInit() { }

}
