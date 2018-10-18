import {takeUntil} from 'rxjs/operators';
import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup} from '@angular/forms';

import {CalService, Settings} from '../cal-service/cal.service';
import {DicoService} from '../../language/dico.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {LoginDialogComponent} from '../../shared-components/login-dialog/login-dialog.component';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';

import {Subject} from 'rxjs';

@Component({
  selector: 'app-cal-settings',
  templateUrl: './cal-settings.component.html',
  styleUrls: ['./cal-settings.component.css']
})


export class CalSettingsComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  public formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone,

    public d: DicoService,
    public cal: CalService,
    public location: Location,
  ) { }

  ngOnInit() {
    this.cal.getSettings().pipe(
      takeUntil(this.unsubscribe))
      .subscribe(settings => {
        if (!settings) settings = {resources: ''};
        this.formGroup = this.fb.group({
          resources: [settings.resources || '', [this.cal.resourcesValidator]]
        });
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  submit() {
    this.cal.setSettings(
      new Settings(
        this.formGroup.get('resources').value
      )
    ).then(() => {
      this.snackBar.open("Ressources mises à jour", 'ok', {duration: 2000});
      this.ngZone.run(() => this.router.navigateByUrl('/calendrier'));
    });
  }

  gatherFromAde() {
    this.dialog.open(LoginDialogComponent, {
      data: {
        title: "Connexion à ADE",
        content: `Identifiants de connexion à ADE`
      }
    }).afterClosed().subscribe(credentials => {
      if (!credentials) return;
      let snackBarRef = this.snackBar.open('Connexion à ADE...');
      this.http.post(environment.proxy.domain + 'action=fetch_ade', credentials, { responseType: 'text'}).subscribe(
				(text: string) => {
	        if (text.startsWith('invalid')) return this.snackBar.open('Identifiants incorrects', 'ok', {duration: 2000});
	        if (text.startsWith('dangerous')) return this.snackBar.open('Caractère dangereux, désolé', 'ok', {duration: 2000});
	        this.formGroup.get('resources').setValue(text);
	        this.submit();
	      },
				(error) => {
					snackBarRef.dismiss();
					this.snackBar.open('Echec de la connexion', 'ok', {duration: 2000});
				}
			);
    });
  }
}
