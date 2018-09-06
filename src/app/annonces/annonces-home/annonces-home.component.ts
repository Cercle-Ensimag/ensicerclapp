import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {DicoService} from '../../language/dico.service';
import {AnnoncesService} from '../annonces.service';

@Component({
  selector: 'app-annonces-home',
  templateUrl: './annonces-home.component.html',
  styleUrls: ['./annonces-home.component.css']
})
export class AnnoncesHomeComponent implements OnInit {

  constructor(
    public annonces: AnnoncesService,
    public d: DicoService,
    public location: Location
  ) { }

  ngOnInit() { }
}
