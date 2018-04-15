import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { AuthService } from '../../auth/auth-service/auth.service';
import { DicoService } from '../../language/dico.service';

@Component({
  selector: 'app-legal-notice',
  templateUrl: './legal-notice.component.html',
  styleUrls: ['../info.component.css']
})
export class LegalNoticeComponent implements OnInit {

  constructor(
    private location: Location,
    public auth: AuthService,
    public d: DicoService
  ) { }

  ngOnInit() {
  }

  back() {
    this.location.back();
  }
}
