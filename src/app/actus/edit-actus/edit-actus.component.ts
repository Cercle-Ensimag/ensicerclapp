import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Actu } from '../actus-home/actus-home.component';

import { AuthService } from '../../auth/auth-service/auth.service';
import { ActusService } from '../actus-service/actus.service';
import { DicoService } from '../../language/dico.service';

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
    public d: DicoService
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

  getTitle(): string {
    return this.actuCtrl.get('title').value;
  }
  getDescription(): string {
    return this.actuCtrl.get('description').value;
  }
  getImage(): string {
    return this.actuCtrl.get('image').value;
  }
  getWDate(): string {
    return this.actuCtrl.get('date').value.toString();
  }
  getAuthor(): string {
    return this.actuCtrl.get('author').value;
  }

  onSubmit() {
    if (!this.actuCtrl.invalid) {
      let actu = {
        id: this.actu.id,
        title: this.getTitle(),
        description: this.getDescription(),
        image: this.getImage(),
        date: this.getWDate(),
        author: this.getAuthor(),
        groupId: this.auth.journalistGroupId
      };
      this.actus.setActu(actu).then(() => {
        this.error = this.d.l.changesApplied;
      });
    }
  }

  back() {
    this.location.back();
  }

}
