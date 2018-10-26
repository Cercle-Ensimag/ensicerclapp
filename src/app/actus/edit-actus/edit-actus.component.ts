
import {first, takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {Actu, ActusService} from '../actus-service/actus.service';

import {AuthService} from '../../auth/auth-service/auth.service';
import {DicoService} from '../../language/dico.service';
import {MatSnackBar} from '@angular/material';
import {Subject} from 'rxjs';



@Component({
  selector: 'app-edit-actus',
  templateUrl: './edit-actus.component.html',
  styleUrls: ['./edit-actus.component.css']
})
export class EditActusComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  public formGroup: FormGroup;
  public id: string;

  constructor(
    private auth: AuthService,
    private actus: ActusService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,

    public location: Location,
    public d: DicoService,
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.initFormGroup();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initFormGroup() {
    this.actus.getActu(this.id).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((actu) => {
        if (!actu) {
          actu = new Actu();
          this.id = this.actus.getActuId();
        }
        this.formGroup = this.fb.group({
          title: [actu.title || '', [Validators.required, Validators.maxLength(30)]],
          description: [actu.description || '', [Validators.maxLength(2000)]],
          image: [actu.image || '', [Validators.maxLength(500)]],
          pdfLink: [actu.pdfLink || '', [Validators.maxLength(500)]],
          date: [new Date(actu.date) || '', [Validators.required]],
          author: [actu.author || '', [Validators.required, Validators.maxLength(50)]]
        });
      });
  }

  submit() {
    this.auth.getJournalistId()
      .pipe(first())
      .subscribe(journalistId => {
        if (!this.formGroup.invalid) {
          const actu = {
            id: this.id,
            title: this.formGroup.get('title').value,
            description: this.formGroup.get('description').value,
            image: this.formGroup.get('image').value,
            pdfLink: this.formGroup.get('pdfLink').value,
            date: this.formGroup.get('date').value.getTime(),
            author: this.formGroup.get('author').value,
            groupId: journalistId
          };
          this.actus.setActu(actu).then(() => {
            this.snackBar.open(this.d.l.changesApplied, this.d.l.okLabel, {duration: 2000});
            this.initFormGroup();
          }).catch(reason => {
            this.snackBar.open(reason, this.d.l.okLabel, {duration: 2000});
          });
        }
      });
  }
}
