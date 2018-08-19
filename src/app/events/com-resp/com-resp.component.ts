import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from '../../auth/auth-service/auth.service';
import { EventsService } from '../events-service/events.service';
import { DicoService } from '../../language/dico.service';

@Component({
  selector: 'app-com-resp',
  templateUrl: './com-resp.component.html',
  styleUrls: ['./com-resp.component.css']
})
export class ComRespComponent implements OnInit, OnDestroy {

  constructor(
    public auth: AuthService,
    public events: EventsService,
    public d: DicoService
  ) { }

  ngOnInit () {
    this.events.start();
  }

  ngOnDestroy () {
    this.events.stop();
  }
}
