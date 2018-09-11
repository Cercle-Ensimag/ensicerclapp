
import {takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Annonce, AnnoncesService} from '../../annonces/annonces.service';
import {AuthService} from '../../auth/auth-service/auth.service';
import {ToolsService} from '../../providers/tools.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {DicoService} from '../../language/dico.service';
import {MatSnackBar} from '@angular/material';
import {Subject} from 'rxjs';



@Component({
  selector: 'app-annonces-edit',
  templateUrl: './annonces-edit.component.html',
  styleUrls: ['./annonces-edit.component.css']
})
export class AnnoncesEditComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  public id: string;
  public formGroup: FormGroup;

  constructor(
    private auth: AuthService,
    private annonces: AnnoncesService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,

    public tools: ToolsService,
    public location: Location,
    public d: DicoService
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
    this.annonces.getAnnonce(this.id).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((annonce) => {
        if (!annonce) {
          annonce = new Annonce();
          annonce.type = 2;
          this.id = this.annonces.getAnnonceId();
        }
        this.formGroup = this.fb.group({
          title: [annonce.title || '', [Validators.required, Validators.maxLength(50)]],
          description: [annonce.description || '', [Validators.required, Validators.maxLength(5000)]],
          type: [annonce.type, [Validators.required, Validators.min(0), Validators.max(2)]],
          start: [new Date(annonce.start) || '', [Validators.required, this.tools.dateValidator]],
          length: [annonce.length || '', [Validators.required, Validators.maxLength(20)]],
          technologies: [annonce.technologies || '', [Validators.required, Validators.maxLength(100)]],
          contact: [annonce.contact || '', [Validators.required, Validators.maxLength(200)]],
          author: [annonce.author || '', [Validators.required, Validators.maxLength(30)]],
          done: [annonce.done || false, [Validators.required]]
        });
      });
  }

  submit() {
    const annonce = {
      id: this.id,
      title: this.formGroup.get('title').value,
      description: this.formGroup.get('description').value,
      type: this.formGroup.get('type').value,
      start: this.formGroup.get('start').value.getTime(),
      length: this.formGroup.get('length').value,
      technologies: this.formGroup.get('technologies').value,
      contact: this.formGroup.get('contact').value,
      author: this.formGroup.get('author').value,
      done: this.formGroup.get('done').value
    };
    this.annonces.setAnnonce(annonce).then(() => {
      this.snackBar.open(this.d.l.changesApplied, 'ok', {duration: 2000});
      this.initFormGroup();
    });
  }
}
