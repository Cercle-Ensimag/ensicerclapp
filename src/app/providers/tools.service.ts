import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable()
export class ToolsService {

  constructor() { }

  titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
  }

  timeValidator(control: FormControl) {
    if (!control.value.match(/^[0-9][0-9]:[0-9][0-9]$/)){
      return { error: true };
    }
    return null;
  }

  dateValidator(control: FormControl) {
    if (!control.value.toString().match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ([0-2][0-9]|3[0-2]) 20[1-9][0-9]/)){
      return { error: true };
    }
    return null;
  }

  getTimeFromDate(date: any) {
    if (!date) {
      return "";
    }
    return (new Date(date)).toString().split(' ')[4].substring(0, 5);
  }

  setDayTime(date: number, time: string) {
    let daySp = (new Date(date)).toString().split(" ");
    daySp[4] = time;
    return (new Date(daySp.join(" "))).getTime();
  }

  round(number: number, precision: number) {
  	var factor = Math.pow(10, precision);
  	var tempNumber = number * factor;
  	var roundedTempNumber = Math.round(tempNumber);
  	return roundedTempNumber / factor;
  }
}
