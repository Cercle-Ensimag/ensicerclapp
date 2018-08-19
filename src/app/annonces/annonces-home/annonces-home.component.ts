import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {DicoService} from '../../language/dico.service';
import {AnnoncesService} from '../annonces.service';

@Component({
  selector: 'app-annonces-home',
  templateUrl: './annonces-home.component.html',
  styleUrls: ['./annonces-home.component.css']
})
export class AnnoncesHomeComponent implements OnInit, OnDestroy {

  constructor(
    public annonces: AnnoncesService,
    public d: DicoService,
    private location: Location
  ) { }

  ngOnInit() {
    this.annonces.start();
  }

  ngOnDestroy() {
    this.annonces.stop();
  }

}
