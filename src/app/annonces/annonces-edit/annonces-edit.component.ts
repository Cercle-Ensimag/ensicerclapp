import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Annonce, AnnoncesService} from '../../annonces/annonces.service';
import {AuthService} from '../../auth/auth-service/auth.service';
import {ToolsService} from '../../providers/tools.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {DicoService} from '../../language/dico.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-annonces-edit',
  templateUrl: './annonces-edit.component.html',
  styleUrls: ['./annonces-edit.component.css']
})
export class AnnoncesEditComponent implements OnInit, OnDestroy {
  annonceCtrl: FormGroup;

  annonce: Annonce;
  annonceWatcher: any;
  annonceCtrlWatcher: any;
  error: string;

  constructor(
    private auth: AuthService,
    private tools: ToolsService,
    private annonces: AnnoncesService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    public d: DicoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.annonceWatcher = this.watchAnnonce(id);
  }

  ngOnDestroy() {
    this.annonceWatcher.unsubscribe();
  }

  watchAnnonce(annonceId: string) {
    return this.annonces.getAnnonce(annonceId).subscribe((annonce) => {
      if (annonce) {
        this.annonce = annonce;
      } else {
        this.annonce = new Annonce();
        this.annonce.id = this.annonces.getAnnonceId();
      }
      this.annonceCtrl = this.fb.group({
        title: [this.annonce.title || '', [Validators.required, Validators.maxLength(50)]],
        description: [this.annonce.description || '', [Validators.required, Validators.maxLength(5000)]],
        type: [this.annonce.type || 2, [Validators.required, Validators.min(0), Validators.max(2)]],
        start: [new Date(this.annonce.start) || '', [Validators.required, this.tools.dateValidator]],
        length: [this.annonce.length || '', [Validators.required, Validators.maxLength(20)]],
        technologies: [this.annonce.technologies || '', [Validators.required, Validators.maxLength(100)]],
        contact: [this.annonce.contact || '', [Validators.required, Validators.maxLength(200)]],
        author: [this.annonce.author || '', [Validators.required, Validators.maxLength(30)]],
        done: [this.annonce.done || false, [Validators.required]]
      })
      if (this.annonceCtrlWatcher) {
        this.annonceCtrlWatcher.unsubscribe();
      }
      this.annonceCtrlWatcher = this.annonceCtrl.valueChanges.subscribe(changes => {});
    });
  }

  submit() {
    if (!this.annonceCtrl.invalid) {
      const annonce = {
        id: this.annonce.id,
        title: this.annonceCtrl.get('title').value,
        description: this.annonceCtrl.get('description').value,
        type: this.annonceCtrl.get('type').value,
        start: this.annonceCtrl.get('start').value.getTime(),
        length: this.annonceCtrl.get('length').value,
        technologies: this.annonceCtrl.get('technologies').value,
        contact: this.annonceCtrl.get('contact').value,
        author: this.annonceCtrl.get('author').value,
        done: this.annonceCtrl.get('done').value
      };
      this.annonces.setAnnonce(annonce).then(() => {
        this.snackBar.open(this.d.l.changesApplied, 'ok', {duration: 2000});
      });
    }
  }
}
