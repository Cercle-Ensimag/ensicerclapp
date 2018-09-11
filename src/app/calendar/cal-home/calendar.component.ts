import {Component, OnInit} from '@angular/core';

import {DicoService} from '../../language/dico.service';
import {DeviceSizeService} from '../../providers/device-size.service';
import {Location} from '@angular/common';


const DAY_LENGTH = 24 * 60 * 60* 1000;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  public editing: boolean;
  public selectedDay: Date = new Date();

  constructor(
    public media: DeviceSizeService,
    public location: Location,
    public d: DicoService
  ) {}

  ngOnInit() {
    this.selectedDay = new Date();
  }

  daysOfTheWeek() {
    let monday = new Date(this.selectedDay);
    while (monday.getDay()!== 1){
      monday = new Date(monday.getTime() - DAY_LENGTH);
    }
    return [
      monday,
      new Date(monday.getTime() + DAY_LENGTH),
      new Date(monday.getTime() + DAY_LENGTH * 2),
      new Date(monday.getTime() + DAY_LENGTH * 3),
      new Date(monday.getTime() + DAY_LENGTH * 4),
      new Date(monday.getTime() + DAY_LENGTH * 5),
      new Date(monday.getTime() + DAY_LENGTH * 6)
    ];
  }

  toggleEditing() {
    this.editing = !this.editing;
  }

  previousDay() {
    this.selectedDay = new Date(this.selectedDay.getTime() - DAY_LENGTH);
  }

  nextDay() {
    this.selectedDay = new Date(this.selectedDay.getTime() + DAY_LENGTH);
  }

  previousWeek() {
    this.selectedDay = new Date(this.selectedDay.getTime() - DAY_LENGTH * 7);
  }

  nextWeek() {
    this.selectedDay = new Date(this.selectedDay.getTime() + DAY_LENGTH * 7);
  }
}
