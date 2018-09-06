import {Component, OnInit} from '@angular/core';

import {CafetService} from '../cafet-service/cafet.service';
import {DicoService} from '../../language/dico.service';

@Component({
  selector: 'app-cafet-info',
  templateUrl: './cafet-info.component.html',
  styleUrls: ['./cafet-info.component.css']
})
export class CafetInfoComponent implements OnInit {

  constructor(
    public cafet: CafetService,
    public d: DicoService
  ) { }

  ngOnInit() { }

}
