import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Actu } from '../actus-service/actus.service';

import { AuthService } from '../../auth/auth-service/auth.service';
import { ActusService } from '../actus-service/actus.service';
import { DicoService } from '../../language/dico.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-edit-actus',
  templateUrl: './edit-actus.component.html',
  styleUrls: ['./edit-actus.component.css']
})
export class EditActusComponent implements OnInit, OnDestroy {
  actuCtrl: FormGroup;

  actu: Actu;
  actuWatcher: any;
  actuCtrlWatcher: any;
  error: string;

  constructor(
    private auth: AuthService,
    private actus: ActusService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    public d: DicoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.actuWatcher = this.watchActu(id);
  }

  ngOnDestroy() {
    this.actuWatcher.unsubscribe();
  }

  watchActu(actuId: string) {
    return this.actus.getActu(actuId).subscribe((actu) => {
      if (actu) {
        this.actu = actu;
      } else {
        this.actu = new Actu();
        this.actu.id = this.actus.getActuId();
      }
      this.actuCtrl = this.fb.group({
        title: [this.actu.title || "", [Validators.required, Validators.minLength(3)]],
        description: [this.actu.description || "", []],
        image: [this.actu.image || "", []],
        pdfLink: [this.actu.pdfLink || "", []],
        date: [new Date(this.actu.date) || "", [Validators.required]],
        author: [this.actu.author || "", [Validators.required]]
      });
      if (this.actuCtrlWatcher) {
        this.actuCtrlWatcher.unsubscribe();
      }
      this.actuCtrlWatcher = this.actuCtrl.valueChanges.subscribe(() => {
        this.error = null;
      });
    });
  }

  submit() {
    if (!this.actuCtrl.invalid) {
      const actu = {
        id: this.actu.id,
        title: this.actuCtrl.get('title').value,
        description: this.actuCtrl.get('description').value,
        image: this.actuCtrl.get('image').value,
		    pdfLink: this.actuCtrl.get('pdfLink').value,
        date: this.actuCtrl.get('date').value.getTime(),
        author: this.actuCtrl.get('author').value,
        groupId: this.auth.journalistGroupId
      };
      console.log(actu);
      this.actus.setActu(actu).then(() => {
        this.snackBar.open(this.d.l.changesApplied, 'ok', {duration: 2000});
      }).catch(reason => {
        this.snackBar.open(reason, 'ok', {duration: 2000});
      });
    }
  }
}
