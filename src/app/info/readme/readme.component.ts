import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { DicoService } from '../../language/dico.service';

@Component({
  selector: 'app-readme',
  templateUrl: './readme.component.html',
  styleUrls: ['./readme.component.css']
})
export class ReadmeComponent implements OnInit {

  constructor(
    private location: Location,
    public d: DicoService
  ) { }

  ngOnInit() {
  }

  back() {
    this.location.back();
  }

}
