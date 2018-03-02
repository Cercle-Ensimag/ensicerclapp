import { Component, OnInit } from '@angular/core';

import { CalService, CalEvent } from '../cal-service/cal.service';
import { DicoService } from '../../language/dico.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  constructor(
    public cal: CalService,
    public d: DicoService
  ) {}

  ngOnInit() {
    this.cal.start();
  }

  isToday(event: CalEvent) {
    let today = (new Date()).getTime();
    let tomorrow = today + 24 * 60 * 60* 1000;
    let start = (new Date(event.startDate)).getTime();
    let end = (new Date(event.endDate)).getTime();

    return ((start > today && start < tomorrow) || (end > today && end < tomorrow));
  }

  ngOnDestroy() {
    this.cal.stop();
  }

}
