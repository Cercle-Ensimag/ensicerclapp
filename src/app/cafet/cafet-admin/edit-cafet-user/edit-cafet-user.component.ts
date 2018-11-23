import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {CafetService, CafetUser} from '../../cafet-service/cafet.service';
import {DicoService} from '../../../language/dico.service';
import {ListService} from '../../../providers/list.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-edit-cafet-user',
  templateUrl: './edit-cafet-user.component.html',
  styleUrls: ['./edit-cafet-user.component.css']
})
export class EditCafetUserComponent {
  public formGroup: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public user: CafetUser,
    private dialogRef: MatDialogRef<EditCafetUserComponent>,
    private cafet: CafetService,
    private list: ListService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,

    public d: DicoService
  ) {
    this.formGroup = this.fb.group({
      firstName: [
				this.user.profile.firstName,
				[Validators.required, Validators.maxLength(30)]
			],
      lastName: [
				this.user.profile.lastName,
				[Validators.required, Validators.maxLength(30)]
			],
      email: [
				this.user.profile.email,
				[Validators.required, Validators.email]
			]
    });
  }

  submit() {
		const email = this.formGroup.get('email').value.toLowerCase();
    this.list.isInList(email)
      .pipe(first())
      .subscribe(notExte => {
        this.cafet.setUserProfile(
					this.user.emailId,
					{
	          firstName: this.formGroup.get('firstName').value,
	          lastName: this.formGroup.get('lastName').value,
	          email: email,
	          exte: !notExte
					},
					this.user.activated
				).then(
					() => this.dialogRef.close(),
					(err) => this.snackBar.open(err, this.d.l.okLabel, {duration: 2000})
				);
      });
  }

  archive() {
    this.cafet.archiveUser(this.user).then(
			() => this.dialogRef.close(),
			(err) => this.snackBar.open(err, this.d.l.okLabel, {duration: 2000})
		);
  }

  restore() {
    this.cafet.restoreUser(this.user).then(
			() => this.dialogRef.close(),
			(err) => this.snackBar.open(err, this.d.l.okLabel, {duration: 2000})
		);
  }

  delete() {
    this.cafet.deleteUser(this.user).then(
			() => this.dialogRef.close(),
			(err) => this.snackBar.open(err, this.d.l.okLabel, {duration: 2000})
		);
  }

}
