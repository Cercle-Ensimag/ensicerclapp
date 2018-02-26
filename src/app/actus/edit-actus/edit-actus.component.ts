import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';

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
  id_ctrl: FormControl;
  title_ctrl: FormControl;
  description_ctrl: FormControl;
  image_ctrl: FormControl;
  date_ctrl: FormControl;
  author_ctrl: FormControl;

  actu: Actu;
  actuWatcher: any;

  constructor(
    private auth: AuthService,
    private actus: ActusService,
    private route: ActivatedRoute,
    private location: Location,
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
        this.id_ctrl = new FormControl({ value: actu.id, disabled: true }, []);
      } else {
        this.actu = new Actu();
        this.id_ctrl = new FormControl("", [Validators.required, Validators.minLength(3)]);
      }
      this.title_ctrl = new FormControl(this.actu.title || "", [Validators.required, Validators.minLength(3)]);
      this.description_ctrl = new FormControl(this.actu.description || "", []);
      this.image_ctrl = new FormControl(this.actu.image || "", []);
      this.date_ctrl = new FormControl(this.actu.date || "", [Validators.required]);
      this.author_ctrl = new FormControl(this.actu.date || "", [Validators.required]);
    });
  }

  onSubmit() {
    if (!this.title_ctrl.invalid && ! this.description_ctrl.invalid) {
      let actu = {
        id: this.id_ctrl.value,
        title: this.title_ctrl.value,
        description: this.description_ctrl.value,
        image: this.image_ctrl.value,
        date: this.date_ctrl.value,
        author: this.author_ctrl.value,
        groupId: this.auth.groupId
      };
      this.actus.setActu(actu);
    }
  }

  back() {
    this.location.back();
  }

}
