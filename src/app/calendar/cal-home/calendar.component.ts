import { Component, OnInit } from '@angular/core';

import { CalService, CalEvent, PERSOS, ASSOS, COURSE } from '../cal-service/cal.service';
import { ToolsService } from '../../providers/tools.service';
import { DicoService } from '../../language/dico.service';
import { DeviceSizeService } from '../../providers/device-size.service'

const DAY_TIME = 24 * 60 * 60* 1000;
const MAX_DAY_OFFSET = 30;
const MIN_DAY_OFFSET = -20;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  dayOffset: number = 0;
  dayEvents: CalEvent[] = [];
  today: number;
  now: number;
  edit: boolean;

  constructor(
    public cal: CalService,
    public media: DeviceSizeService,
    private tools: ToolsService,
    public d: DicoService
  ) {}

  ngOnInit() {
    this.today = this.getToday();
    this.cal.start();
  }

  ngOnDestroy() {
    this.cal.stop();
  }

  getToday() {
    return this.tools.setDayTime((new Date()).getTime(), "00:00:00");
  }

  isToday(event: CalEvent) {
    let currentDay = this.getToday() + this.getTimeOffset();
    let nextDay = currentDay + DAY_TIME;
    return (
      (event.start >= currentDay && event.start < nextDay) ||
      (event.end >= currentDay && event.end < nextDay) ||
      (event.start < currentDay && event.end >= nextDay)
    );
  }

  isNow(event: CalEvent) {
    return event.start < Date.now() && event.end > Date.now();
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

  isDayEvents() {
    this.dayEvents = this.getDayEvents();
    return this.dayEvents;
  }

  getTimeOffset() {
    return this.dayOffset * DAY_TIME;
  }

  nextDay () {
    this.dayOffset = (this.dayOffset+1-MIN_DAY_OFFSET)%(MAX_DAY_OFFSET-MIN_DAY_OFFSET)+MIN_DAY_OFFSET;
  }

  previousDay () {
    this.dayOffset = (this.dayOffset-MAX_DAY_OFFSET)%(MAX_DAY_OFFSET-MIN_DAY_OFFSET)+MAX_DAY_OFFSET-1;
  }

}
