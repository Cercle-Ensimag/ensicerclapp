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
  now: number;

  constructor(
    public cal: CalService,
    public d: DicoService
  ) {}

  ngOnInit() {
    this.today = this.getToday();
    this.now = Date.now();
    this.cal.start();
  }

  ngOnDestroy() {
    this.cal.stop();
  }

  getToday() {
    let today = (new Date()).getTime();
    return today - today % DAY_TIME - GMT_OFFSET;
  }

  isToday(event: CalEvent) {
    let tomorrow = this.today + DAY_TIME;
    let timeOffset = this.getTimeOffset();
    return (
      (event.start > this.today + timeOffset && event.start < tomorrow + timeOffset) ||
      (event.end > this.today + timeOffset && event.end < tomorrow + timeOffset)
    );
  }

  isNow(event: CalEvent) {
    return event.start < this.now && event.end > this.now;
  }

  color(event: CalEvent) {
    if (this.isNow(event)) {
      return "primary";
    } else {
      return "";
    }
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
    this.dayOffset = (this.dayOffset+1+20)%50-20;
  }

  previousDay () {
    this.dayOffset = (this.dayOffset-30)%50+30-1;
  }

}
