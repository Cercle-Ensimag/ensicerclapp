import {Component, OnInit} from '@angular/core';

import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

import {DicoService} from '../../language/dico.service';
import {NsigmaService} from '../nsigma.service';

@Component({
  selector: 'app-nsigma-annonce',
  templateUrl: './nsigma-annonce.component.html',
  styleUrls: ['./nsigma-annonce.component.css']
})
export class NsigmaAnnonceComponent implements OnInit {
  public id: string;

  constructor(
    private route: ActivatedRoute,

    public nsigma: NsigmaService,
    public d: DicoService,
    public location: Location
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
  }
}
