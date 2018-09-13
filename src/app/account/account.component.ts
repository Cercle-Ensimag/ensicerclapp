import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AuthService, Profile} from '../auth/auth-service/auth.service';
import {DicoService} from '../language/dico.service';
import {DeleteDialogComponent} from '../shared-components/delete-dialog/delete-dialog.component';
import {UpdatePasswordDialogComponent} from './components/update-password-dialog/update-password-dialog.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Location} from '@angular/common';
import {Subject, combineLatest} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {User} from 'firebase/app';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  public formGroup: FormGroup;

  constructor(
    private auth: AuthService,
    private d: DicoService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,

    public location: Location
  ) { }

  ngOnInit() {
    combineLatest(
      this.auth.getProfile(),
      this.auth.getLoggedUser())
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([profile, user]: [Profile, User]) => {
        this.formGroup = this.fb.group({
          firstname: [profile.name.firstName, [Validators.required, Validators.maxLength(30)]],
          lastname: [profile.name.lastName, [Validators.required, Validators.maxLength(30)]],
          login: [profile.name.login, [Validators.maxLength(30)]],
          email: [{ value: user.email, disabled: true }, [Validators.required, Validators.email, this.auth.emailDomainValidator]]
        });
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  updateProfile() {
    this.auth.updateProfile(new Profile(
      this.formGroup.get('firstname').value,
      this.formGroup.get('lastname').value,
      this.formGroup.get('login').value,
      ''
    ))
    .then(() => {
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
        .catch(err => {
          this.snackBar.open(err, 'ok');
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
