import {Component, OnInit} from '@angular/core';

import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

import {DicoService} from '../../language/dico.service';
import {AnnoncesService} from '../annonces.service';

@Component({
  selector: 'app-annonces-annonce',
  templateUrl: './annonces-annonce.component.html',
  styleUrls: ['./annonces-annonce.component.css']
})
export class AnnoncesAnnonceComponent implements OnInit {
  public id: string;

  constructor(
    private route: ActivatedRoute,

    public annonces: AnnoncesService,
    public d: DicoService,
    public location: Location
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
  }
}
