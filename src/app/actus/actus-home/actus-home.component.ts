import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActusService } from '../actus-service/actus.service';
import { DicoService } from '../../language/dico.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-actus-home',
  templateUrl: './actus-home.component.html',
  styleUrls: ['./actus-home.component.css']
})
export class ActusHomeComponent implements OnInit, OnDestroy {

  constructor(
    public actus: ActusService,
    public d: DicoService,
    public location: Location
  ) { }

  ngOnInit() {
    this.actus.start();
  }

  ngOnDestroy() {
    this.actus.stop();
  }

}
