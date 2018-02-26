import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { DicoService } from '../../language/dico.service';
import { ActusService } from '../actus-service/actus.service';

import { Actu } from '../actus-home/actus-home.component';

@Component({
  selector: 'app-actu',
  templateUrl: './actu.component.html',
  styleUrls: ['./actu.component.css']
})
export class ActuComponent implements OnInit {

  actu: Actu;
  actuWatcher: any;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public actus: ActusService,
    public d: DicoService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.actuWatcher = this.watchActu(id);
  }

  watchActu(actuId: string) {
    return this.actus.getActu(actuId).subscribe((actu) => {
      this.actu = actu;
    });
  }

  back() {
    this.location.back();
  }
}
