import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActusService } from '../actus-service/actus.service';
import { DicoService } from '../../language/dico.service';

export class Actu {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  author: string;
  groupId: string;
}

@Component({
  selector: 'app-actus-home',
  templateUrl: './actus-home.component.html',
  styleUrls: ['./actus-home.component.css']
})
export class ActusHomeComponent implements OnInit, OnDestroy {

  constructor(
    public actus: ActusService,
    public d: DicoService
  ) { }

  ngOnInit() {
    this.actus.start();
  }

  ngOnDestroy() {
    this.actus.stop();
  }

}