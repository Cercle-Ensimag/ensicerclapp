import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CalService, Settings } from '../cal-service/cal.service';
import { DicoService } from '../../language/dico.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DeleteDialogComponent} from '../../shared-components/delete-dialog/delete-dialog.component';
import {LoginDialogComponent} from '../../shared-components/login-dialog/login-dialog.component';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {text} from 'body-parser';

@Component({
  selector: 'app-cal-settings',
  templateUrl: './cal-settings.component.html',
  styleUrls: ['./cal-settings.component.css']
})
export class CalSettingsComponent implements OnInit, OnDestroy {

  settingsCtrl: FormGroup;
  settingsCtrlWatcher: any;
  resourcesWatcher: any;

  error: string;

  constructor(
    private cal: CalService,
    private location: Location,
    private fb: FormBuilder,
    public d: DicoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.settingsCtrl = this.fb.group({
      resources: ["", [this.cal.resourcesValidator]]
    });
    this.settingsCtrlWatcher = this.settingsCtrl.valueChanges.subscribe(() => {
      this.error = null;
    });
    this.resourcesWatcher = this.watchResources();
  }

  ngOnDestroy() {
    this.resourcesWatcher.unsubscribe();
  }

  watchResources() {
    return this.cal.getSettings().subscribe(settings => {
      if (settings != null) {
        this.settingsCtrl.get('resources').setValue(settings.resources || "");
      }
    })
  }

  submit() {
    if (!this.settingsCtrl.invalid) {
      this.cal.setSettings(
        new Settings(
          this.settingsCtrl.get('resources').value
        )
      ).then(() => {
        this.snackBar.open("Ressources mises à jour", 'ok', {duration: 2000});
      });
    }
  }

  gatherFromAde() {
    this.dialog.open(LoginDialogComponent, {
      data: {
        title: "Connexion à ADE",
        content: `Identifiants de connexion à ADE`
      }
    }).afterClosed().subscribe(credentials => {
      if (!credentials) return;
      this.snackBar.open('Connexion à ADE...');
      this.http.post(environment.proxy.domain + 'action=fetch_ade', credentials, { responseType: 'text'}).subscribe( (text: string) => {
        if (text.startsWith('invalid')) return this.snackBar.open(`Identifiants incorrects`, 'ok', {duration: 2000});
        this.settingsCtrl.get('resources').setValue(text);
        this.submit();
      });
    });
  }
}
