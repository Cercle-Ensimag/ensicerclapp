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
      this.snackBar.open(this.d.l.updatedResourcesInfo, this.d.l.okLabel, {duration: 2000});
      this.ngZone.run(() => this.router.navigateByUrl('/calendar'));
    });
  }

  gatherFromAde() {
    this.dialog.open(LoginDialogComponent, {
      data: {
        title: this.d.l.ADECredentialsDialogTitle,
        content: this.d.l.ADECredentialsDialogContent
      }
    }).afterClosed().subscribe(credentials => {
      if (!credentials) return;
      let snackBarRef = this.snackBar.open(this.d.l.waitADEConnectionInfo);
      this.http.post(environment.proxy.domain + 'action=fetch_ade', credentials, { responseType: 'text'}).subscribe(
				(text: string) => {
	        if (text.startsWith('invalid')) return this.snackBar.open(this.d.l.invalidADECredentialsError, this.d.l.okLabel, {duration: 2000});
	        if (text.startsWith('dangerous')) return this.snackBar.open(this.d.l.dangerousADECredentialsError, this.d.l.okLabel, {duration: 2000});
	        this.formGroup.get('resources').setValue(text);
	        this.submit();
	      },
				(error) => {
					snackBarRef.dismiss();
					this.snackBar.open(this.d.l.ADEConnectionError, this.d.l.okLabel, {duration: 2000});
				}
			);
    });
  }
}
