import {Component, OnDestroy, OnInit} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { DicoService } from '../../language/dico.service';
import { AnnoncesService } from '../annonces.service';

import { Annonce } from '../annonces.service';

@Component({
  selector: 'app-annonces-annonce',
  templateUrl: './annonces-annonce.component.html',
  styleUrls: ['./annonces-annonce.component.css']
})
export class AnnoncesAnnonceComponent implements OnInit, OnDestroy {

  annonce: Annonce;
  annoncesAnnonceWatcher: any;

  constructor(
    private route: ActivatedRoute,
    public annonces: AnnoncesService,
    public d: DicoService,
    private location: Location
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.annonce = null;
    this.annoncesAnnonceWatcher = this.watchAnnonce(id);
  }

  ngOnDestroy() {
    if (this.annoncesAnnonceWatcher) {
      this.annoncesAnnonceWatcher.unsubscribe();
    }
  }

  watchAnnonce(annonceId: string) {
    return this.annonces.getAnnonce(annonceId).subscribe((annonce) => {
      this.annonce = annonce;
    });
  }

}
