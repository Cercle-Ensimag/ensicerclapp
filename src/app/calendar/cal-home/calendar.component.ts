import { Component, OnInit } from '@angular/core';

import { CalService, CalEvent, PERSOS, ASSOS, COURSE } from '../cal-service/cal.service';
import { ToolsService } from '../../providers/tools.service';
import { DicoService } from '../../language/dico.service';
import { DeviceSizeService } from '../../providers/device-size.service'
import {Location} from '@angular/common';


const DAY_TIME = 24 * 60 * 60* 1000;
const WEEK_LENGTH = 7;
const MAX_DAY_OFFSET = 300;
const MIN_DAY_OFFSET = -200;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  dayOffset: number = 0;
  dayEvents: CalEvent[];
  edit: boolean;

  constructor(
    public cal: CalService,
    public media: DeviceSizeService,
    private tools: ToolsService,
    public location: Location,
    public d: DicoService
  ) {}

  ngOnInit() {
    this.cal.start();
    this.cal.setComponent(this);
  }

  ngOnDestroy() {
    this.cal.stop();
  }

  calCallback() {
    this.isDayEvents();
  }

  getToday() {
    return this.tools.setDayTime((new Date()).getTime(), "06:12:42");
  }

  getDay(dayOffset: number) {
    return this.tools.setDayTime(
      this.getToday() + DAY_TIME * dayOffset,
      "00:00:00"
    )
  }

  isToday(event: CalEvent) {
    for (var index=0; index<event.occurences; index++) {
      let currentDay = this.getDay(this.dayOffset - index*WEEK_LENGTH);
      let nextDay = this.getDay(this.dayOffset + 1 - index*WEEK_LENGTH);
      if (
        (event.start >= currentDay && event.start < nextDay) ||
        (event.end >= currentDay && event.end < nextDay) ||
        (event.start < currentDay && event.end >= nextDay)
      ) {
        return true;
      }
    }
    return false;
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

	singleDay(event: CalEvent) {
		return this.tools.setDayTime(event.start, "00:00:00") == this.tools.setDayTime(event.end, "00:00:00")
	}

  getDayEvents() {
    if (!this.cal.calEvents) {
      return null;
    }
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
    this.isDayEvents();
  }

  previousDay () {
    this.dayOffset = (this.dayOffset-MAX_DAY_OFFSET)%(MAX_DAY_OFFSET-MIN_DAY_OFFSET)+MAX_DAY_OFFSET-1;
    this.isDayEvents();
  }

  setToToday() {
    this.dayOffset = 0;
    this.isDayEvents();
  }

}
