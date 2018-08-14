import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-annonces-home',
  templateUrl: './annonces-home.component.html',
  styleUrls: ['./annonces-home.component.css']
})
export class AnnoncesHomeComponent implements OnInit {

  constructor(
    public location: Location
  ) { }

  ngOnInit() {
  }

}
