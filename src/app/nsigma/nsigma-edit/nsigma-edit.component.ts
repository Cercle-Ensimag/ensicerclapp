import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../auth/auth-service/auth.service';
import {ToolsService} from '../../providers/tools.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {DicoService} from '../../language/dico.service';
import {NsigmaAnnonce, NsigmaService} from '../nsigma.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-nsigma-edit',
  templateUrl: './nsigma-edit.component.html',
  styleUrls: ['./nsigma-edit.component.css']
})
export class NsigmaEditComponent implements OnInit, OnDestroy {
  nsigmaAnnonceCtrl: FormGroup;

  nsigmaAnnonce: NsigmaAnnonce;
  nsigmaAnnonceWatcher: any;
  nsigmaAnnonceCtrlWatcher: any;
  error: string;

  constructor(
    private auth: AuthService,
    private tools: ToolsService,
    private nsigmaAnnonces: NsigmaService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    public d: DicoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.nsigmaAnnonceWatcher = this.watchNsigmaAnnonce(id);
  }

  ngOnDestroy() {
    this.nsigmaAnnonceWatcher.unsubscribe();
  }

  watchNsigmaAnnonce(nsigmaAnnonceId: string) {
    return this.nsigmaAnnonces.getNsigmaAnnonce(nsigmaAnnonceId).subscribe((nsigmaAnnonce) => {
      if (nsigmaAnnonce) {
        this.nsigmaAnnonce = nsigmaAnnonce;
      } else {
        this.nsigmaAnnonce = new NsigmaAnnonce();
        this.nsigmaAnnonce.id = this.nsigmaAnnonces.getNsigmaAnnonceId();
      }
      this.nsigmaAnnonceCtrl = this.fb.group({
        title: [this.nsigmaAnnonce.title || '', [Validators.required, Validators.maxLength(50)]],
        description: [this.nsigmaAnnonce.description || '', [Validators.required, Validators.maxLength(5000)]],
        type: [this.nsigmaAnnonce.type || 6, [Validators.required, Validators.min(0), Validators.max(6)]],
        start: [new Date(this.nsigmaAnnonce.start) || '', [Validators.required, this.tools.dateValidator]],
        end: [new Date(this.nsigmaAnnonce.end) || '', [Validators.required, this.tools.dateValidator]],
        technologies: [this.nsigmaAnnonce.technologies || '', [Validators.required, Validators.maxLength(100)]],
        difficulty: [this.nsigmaAnnonce.difficulty || '', [Validators.required, Validators.maxLength(100)]],
        remuneration: [this.nsigmaAnnonce.remuneration || 0, [Validators.required, Validators.min(0), Validators.max(500000)]],
        form: [this.nsigmaAnnonce.form || '', [Validators.required, this.tools.urlValidator, Validators.maxLength(100)]],
        done: [this.nsigmaAnnonce.done || false, [Validators.required]]
      })
      if (this.nsigmaAnnonceCtrlWatcher) {
        this.nsigmaAnnonceCtrlWatcher.unsubscribe();
      }
      this.nsigmaAnnonceCtrlWatcher = this.nsigmaAnnonceCtrl.valueChanges.subscribe(changes => {});
    });
  }

  submit() {
    if (!this.nsigmaAnnonceCtrl.invalid) {
      const nsigmaAnnonce = {
        id: this.nsigmaAnnonce.id,
        title: this.nsigmaAnnonceCtrl.get('title').value,
        description: this.nsigmaAnnonceCtrl.get('description').value,
        type: this.nsigmaAnnonceCtrl.get('type').value,
        start: this.nsigmaAnnonceCtrl.get('start').value.getTime(),
        end: this.nsigmaAnnonceCtrl.get('end').value.getTime(),
        technologies: this.nsigmaAnnonceCtrl.get('technologies').value,
        difficulty: this.nsigmaAnnonceCtrl.get('difficulty').value,
        remuneration: this.nsigmaAnnonceCtrl.get('remuneration').value,
        form: this.nsigmaAnnonceCtrl.get('form').value,
        done: this.nsigmaAnnonceCtrl.get('done').value
      };
      this.nsigmaAnnonces.setNsigmaAnnonce(nsigmaAnnonce).then(() => {
        this.snackBar.open(this.d.l.changesApplied, 'ok', {duration: 2000});
      });
    }
  }
}
