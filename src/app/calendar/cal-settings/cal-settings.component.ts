import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CalService, Settings } from '../cal-service/cal.service';
import { DicoService } from '../../language/dico.service';

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
    public d: DicoService
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

  onSubmit() {
    if (!this.settingsCtrl.invalid) {
      this.cal.setSettings(
        new Settings(
          this.settingsCtrl.get('resources').value
        )
      ).then(() => {
        this.error = this.d.l.changesApplied;
      });
    }
  }

  back() {
    this.location.back();
  }
}
