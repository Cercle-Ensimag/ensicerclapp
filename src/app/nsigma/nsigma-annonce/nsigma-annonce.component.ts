import {Component, OnDestroy, OnInit} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { DicoService } from '../../language/dico.service';
import { NsigmaService } from '../nsigma.service';

import { NsigmaAnnonce } from '../nsigma.service';

@Component({
  selector: 'app-nsigma-annonce',
  templateUrl: './nsigma-annonce.component.html',
  styleUrls: ['./nsigma-annonce.component.css']
})
export class NsigmaAnnonceComponent implements OnInit, OnDestroy {

  annonce: NsigmaAnnonce;
  nsigmaAnnonceWatcher: any;

  constructor(
    private route: ActivatedRoute,
    public nsigma: NsigmaService,
    public d: DicoService,
    private location: Location
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.annonce = null;
    this.nsigmaAnnonceWatcher = this.watchNsigmaAnnonce(id);
  }

  ngOnDestroy() {
    if (this.nsigmaAnnonceWatcher) {
      this.nsigmaAnnonceWatcher.unsubscribe();
    }
  }

  watchNsigmaAnnonce(nsigmaAnnonceId: string) {
    return this.nsigma.getNsigmaAnnonce(nsigmaAnnonceId).subscribe((nsigmaAnnonce) => {
      this.annonce = nsigmaAnnonce;
    });
  }

}
