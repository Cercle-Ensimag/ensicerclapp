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

  deleteEventId: string;
  deleteEventTitle: string;

  constructor(
    public auth: AuthService,
    private events: EventsService,
    public d: DicoService
  ) {
    this.deleteEventId = null;
  }

  ngOnInit () {
    this.events.start();
  }

  ngOnDestroy () {
    this.events.stop();
  }

  delete(eventId: string, eventTitle: string) {
    this.deleteEventId = eventId;
    this.deleteEventTitle = eventTitle;
  }

  back() {
    this.deleteEventId = null;
  }

  confirmDelete() {
    this.events.deleteEvent(this.deleteEventId);
    this.back();
  }

}
