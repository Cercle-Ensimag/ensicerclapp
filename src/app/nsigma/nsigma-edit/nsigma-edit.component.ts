
import {takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../auth/auth-service/auth.service';
import {ToolsService} from '../../providers/tools.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {DicoService} from '../../language/dico.service';
import {NsigmaAnnonce, NsigmaService} from '../nsigma.service';
import {MatSnackBar} from '@angular/material';
import {Subject} from 'rxjs';



@Component({
  selector: 'app-nsigma-edit',
  templateUrl: './nsigma-edit.component.html',
  styleUrls: ['./nsigma-edit.component.css']
})
export class NsigmaEditComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  private id: string;

  public formGroup: FormGroup;

  constructor(
    private auth: AuthService,
    private nsigma: NsigmaService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private d: DicoService,
    private snackBar: MatSnackBar,

    public tools: ToolsService,
    public location: Location,
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
    return this.nsigma
      .getAnnonce(this.id).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((annonce) => {
        if (!annonce) {
          annonce = new NsigmaAnnonce();
          annonce.type = 6;
          this.id = this.nsigma.getAnnonceId();
        }
        this.formGroup = this.fb.group({
          title: [annonce.title || '', [Validators.required, Validators.maxLength(50)]],
          description: [annonce.description || '', [Validators.required, Validators.maxLength(5000)]],
          type: [annonce.type, [Validators.required, Validators.min(0), Validators.max(6)]],
          start: [new Date(annonce.start) || '', [Validators.required, this.tools.dateValidator]],
          end: [new Date(annonce.end) || '', [Validators.required, this.tools.dateValidator]],
          technologies: [annonce.technologies || '', [Validators.required, Validators.maxLength(100)]],
          difficulty: [annonce.difficulty || '', [Validators.required, Validators.maxLength(100)]],
          remuneration: [annonce.remuneration || 0, [Validators.required, Validators.min(0), Validators.max(500000)]],
          form: [annonce.form || '', [Validators.required, this.tools.urlValidator, Validators.maxLength(100)]],
          done: [annonce.done || false, [Validators.required]]
        });
        this.formGroup.get('start')
          .valueChanges.pipe(
          takeUntil(this.unsubscribe))
          .subscribe(value => this.formGroup.get('end').setValue(value));
    });
  }

  submit() {
    const annonce = {
      id: this.id,
      title: this.formGroup.get('title').value,
      description: this.formGroup.get('description').value,
      type: this.formGroup.get('type').value,
      start: this.formGroup.get('start').value.getTime(),
      end: this.formGroup.get('end').value.getTime(),
      technologies: this.formGroup.get('technologies').value,
      difficulty: this.formGroup.get('difficulty').value,
      remuneration: this.formGroup.get('remuneration').value,
      form: this.formGroup.get('form').value,
      done: this.formGroup.get('done').value
    };
    this.nsigma.setAnnonce(annonce).then(() => {
      this.snackBar.open(this.d.l.changesApplied, 'ok', {duration: 2000});
      this.initFormGroup();
    });
  }
}
