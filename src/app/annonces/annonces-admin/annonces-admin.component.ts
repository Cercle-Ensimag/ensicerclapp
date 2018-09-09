import {Component, OnInit} from '@angular/core';
import {AnnoncesService} from '../annonces.service';
import {DicoService} from '../../language/dico.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-annonces-admin',
  templateUrl: './annonces-admin.component.html',
  styleUrls: ['./annonces-admin.component.css']
})
export class AnnoncesAdminComponent implements OnInit {

  constructor(
    public annonces: AnnoncesService,
    public d: DicoService,
    public location: Location
  ) {}

  ngOnInit() { }
}
