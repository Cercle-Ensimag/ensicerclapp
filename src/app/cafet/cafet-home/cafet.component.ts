import { Component, OnInit } from '@angular/core';

import { CafetService } from '../cafet-service/cafet.service';
import { DicoService } from '../../language/dico.service';

@Component({
  selector: 'app-cafet',
  templateUrl: './cafet.component.html',
  styleUrls: ['./cafet.component.css']
})
export class CafetComponent implements OnInit {

  creditError: string;

  constructor(
    public cafet: CafetService,
    public d: DicoService
  ) { }

  ngOnInit() {
  }

  isCreditError(): boolean {
    if (this.cafet.credit < 0) {
      this.creditError = this.d.l.negativeCreditError;
      return true;
    } else {
      this.creditError = null;
      return false;
    }
  }

  getCreditError(): string {
    return this.creditError;
  }

}
