import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {AuthService, Profile} from '../auth/auth-service/auth.service';
import {DicoService} from '../language/dico.service';
import {DeleteDialogComponent} from '../shared-components/delete-dialog/delete-dialog.component';
import {UpdatePasswordDialogComponent} from './components/update-password-dialog/update-password-dialog.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Location} from '@angular/common';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  password_ctrl: FormControl;
  formGroup: FormGroup = null;

  constructor(
    private auth: AuthService,
    private d: DicoService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private location: Location
  ) { }

  ngOnInit() {
    this.auth.waitForAccessToXToBeSet('profile')
    .take(1)
    .subscribe(_ => {
      this.formGroup = this.fb.group({
        first_ctrl: [this.auth.profile.name.firstName, [Validators.required]],
        last_ctrl: [this.auth.profile.name.lastName, [Validators.required]],
        login_ctrl: [this.auth.profile.name.login, []],
        email_ctrl: [{ value: this.auth.getCurrentUser().email, disabled: true }, [Validators.required, Validators.email, this.auth.emailDomainValidator]]
      });
    })
  }

  updateProfile() {
    this.auth.updateProfile(new Profile(
      this.formGroup.get('first_ctrl').value,
      this.formGroup.get('last_ctrl').value,
      this.formGroup.get('login_ctrl').value,
      ""
    ))
    .then(_ => {
      this.snackBar.open(this.d.l.changesApplied, 'ok', {duration: 2000});
    });
  }

  deleteAccount() {
    this.dialog.open(DeleteDialogComponent, {
      data: {
        title: "Confirmation de la suppression",
        content: `Êtes-vous certain de vouloir supprimer votre compte ?`
      }
    }).afterClosed().subscribe(result => {
      if (result){
        this.auth.deleteAccount()
        .then(() => {
          this.snackBar.open('suppression effectuée', 'ok', {duration: 2000});
          this.auth.setError(this.d.l.accountDeletedInfo, true);
        })
        .catch(() => {
          this.snackBar.open('erreur', 'ok', {duration: 2000});
          this.auth.setError(this.d.l.refreshTokenInfo, true);
          this.auth.logout();
        })
      }
    });
  }

  newPassword() {
    this.dialog.open(UpdatePasswordDialogComponent)
    .afterClosed().subscribe(result => {
      if (result){
        this.auth.updatePassword(result.password)
        .then(() => {
          this.snackBar.open(this.d.l.changesApplied, 'ok', {duration: 2000});
          this.auth.setError(this.d.l.passwordChangedInfo, true);
          this.auth.logout();
        })
        .catch(() => {
          this.snackBar.open('erreur', 'ok', {duration: 2000});
          this.auth.setError(this.d.l.refreshTokenInfo, true);
          this.auth.goToLogin();
        })
      }
    });
  }
}
