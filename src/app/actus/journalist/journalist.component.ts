import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from '../../auth/auth-service/auth.service';
import { ActusService } from '../actus-service/actus.service';
import { DicoService } from '../../language/dico.service';

@Component({
  selector: 'app-journalist',
  templateUrl: './journalist.component.html',
  styleUrls: ['./journalist.component.css']
})
export class JournalistComponent implements OnInit, OnDestroy {

  deleteActuId: string;
  deleteActuTitle: string;

  constructor(
    public auth: AuthService,
    private actus: ActusService,
    public d: DicoService
  ) {
    this.deleteActuId = null;
  }

  ngOnInit () {
    this.actus.start();
  }

  ngOnDestroy () {
    this.actus.stop();
  }

  delete(actuId: string, actuTitle: string) {
    this.deleteActuId = actuId;
    this.deleteActuTitle = actuTitle;
  }

  back() {
    this.deleteActuId = null;
  }

  confirmDelete() {
    this.actus.deleteActu(this.deleteActuId);
    this.back();
  }

}
