import { Component, OnInit } from '@angular/core';

import { CalService, CalEvent } from '../cal-service/cal.service';
import { DicoService } from '../../language/dico.service';

const DAY_TIME = 24 * 60 * 60* 1000;
const GMT_OFFSET = 60 * 60* 1000;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  dayOffset: number = 0;
  today: number;

  constructor(
    public cal: CalService,
    public d: DicoService
  ) {}

  ngOnInit() {
    this.today = (new Date()).getTime();
    this.today = this.today - this.today % DAY_TIME - GMT_OFFSET;
    this.cal.start();
  }

  ngOnDestroy() {
    this.cal.stop();
  }

  isToday(event: CalEvent) {
    let tomorrow = this.today + DAY_TIME;
    let start = (new Date(event.startDate)).getTime();
    let end = (new Date(event.endDate)).getTime();
    let timeOffset = this.getTimeOffset();
    return (
      (start > this.today + timeOffset && start < tomorrow + timeOffset) ||
      (end > this.today + timeOffset && end < tomorrow + timeOffset)
    );
  }

  getDayEvents() {
    return this.cal.calEvents.filter(event => this.isToday(event));
  }

  getDisplayEvents() {
    return this.getDayEvents();
  }

  getTimeOffset() {
    return this.dayOffset * DAY_TIME;
  }

  nextDay () {
    this.dayOffset++;
  }

  previousDay () {
    this.dayOffset--;
  }

}
