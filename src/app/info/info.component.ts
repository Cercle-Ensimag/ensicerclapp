import { Component, OnInit } from '@angular/core';
import { DicoService } from '../language/dico.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  legalNotice = false;
  userGuide = true;

  constructor(public d: DicoService) { }

  ngOnInit() {
  }

}
