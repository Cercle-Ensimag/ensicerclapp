import { Component, OnInit } from '@angular/core';
import { DicoService } from '../language/dico.service';
import { AuthService } from '../auth/auth-service/auth.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  legalNotice = false;
  userGuide = true;

  constructor(
      public d: DicoService,
      public auth: AuthService
  ) { }

  ngOnInit() {
  }

}