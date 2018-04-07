import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CafetService, CafetUser } from '../../cafet-service/cafet.service';
import { DicoService } from '../../../language/dico.service';

@Component({
  selector: 'app-edit-cafet-user',
  templateUrl: './edit-cafet-user.component.html',
  styleUrls: ['./edit-cafet-user.component.css']
})
export class EditCafetUserComponent {

  profileCtrl: FormGroup;
  activated: boolean;

  error: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public user: CafetUser,
    public dialogRef: MatDialogRef<EditCafetUserComponent>,
    public cafet: CafetService,
    private fb: FormBuilder,
    public d: DicoService
  ) {
    this.activated = user.activated;
    this.profileCtrl = this.fb.group({
      firstName: [this.user.profile.firstName, [Validators.required]],
      lastName: [this.user.profile.lastName, [Validators.required]],
      email: [this.user.profile.email, [
        Validators.required,
        Validators.email
      ]]
    });
  }

  getFirstName(): string {
    return this.profileCtrl.get('firstName').value;
  }
  getLastName(): string {
    return this.profileCtrl.get('lastName').value;
  }
  getEmail(): string {
    return this.profileCtrl.get('email').value;
  }

  onSubmit() {
    this.cafet.setUserProfile(this.user.emailId, {
      firstName: this.getFirstName(),
      lastName: this.getLastName(),
      email: this.getEmail(),
      exte: this.user.profile.exte
    }).then(() => {
      this.dialogRef.close();
    }).catch((err) => {
      this.error = err;
    });
  }

  archive() {
    this.cafet.archiveUser(this.user).then(() => {
      this.dialogRef.close();
    }).catch((err) => {
      this.error = err;
    });
  }

  restore() {
    this.cafet.restoreUser(this.user).then(() => {
      this.dialogRef.close();
    }).catch((err) => {
      this.error = err;
    });
  }

  delete() {
    this.cafet.deleteUser(this.user).then(() => {
      this.dialogRef.close();
    }).catch((err) => {
      this.error = err;
    });
  }

}
