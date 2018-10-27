import {Injectable} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable, merge, of, EMPTY} from 'rxjs';
import {map, tap} from 'rxjs/operators';

@Injectable()
export class ToolsService {

  constructor() { }

  // Turn an observable into a cached observable (use only if results can be stored as JSON)
  enableCache(toCache: Observable<any>, identifier: string, json: boolean = true, mapTo: Function = null) {
    return merge(
      toCache.pipe(tap(result => localStorage.setItem(identifier, json ? JSON.stringify(result) : result))),
      localStorage.getItem(identifier) ? of(
        json ? ( mapTo ? JSON.parse(localStorage.getItem(identifier)).map(mapTo) : JSON.parse(localStorage.getItem(identifier)) ) :
          localStorage.getItem(identifier)) :
        EMPTY);
  }


  getEmailIdFromEmail(email: string) {
    return email.toLowerCase().split("@")[0].replace('.', '|');
  }

	getNameFromEmailId(emailId: string): string {
		return this.titleCase(emailId.replace('|', ' ').replace('  ', ' '));
	}

  titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
  }

  urlValidator(control: FormControl) {
    if (!control.value.match(/^http(s)?:\/\//)){
      return { error: true };
    }
    return null;
  }

  timeValidator(control: FormControl) {
    if (!control.value.match(/^[0-9][0-9]:[0-9][0-9]$/)){
      return { error: true };
    }
    return null;
  }

  dateValidator() {
    /*
    if (!control.value.toString().match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ([0-2][0-9]|3[0-2]) 20[1-9][0-9]/)){
      return { error: true };
    }
    */
    return null;
  }

  getTimeFromDate(date: any) {
    if (!date) {
      return '';
    }
    return (new Date(date)).toString().split(' ')[4].substring(0, 5);
  }

  setDayTime(date: number, time: string) {
    let daySp = (new Date(date)).toString().split(" ");
    daySp[4] = time;
    return (new Date(daySp.join(" "))).getTime();
  }

  round(number: number, precision: number) {
    const factor = Math.pow(10, precision);
    const tempNumber = number * factor;
    const roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  }

  // TODO: Transformer en pipe.
  truncate(sentence: string, maxLength: number = 100): string{
    return sentence.slice(0, maxLength) + (sentence.length > 100 ? '...' : '');
  }

  djb2(str: string){
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    }
    return hash;
  }

  hashStringToColor(str: string) {
    const hash = this.djb2(str);
    const r = (hash & 0xFF0000) >> 16;
    const g = (hash & 0x00FF00) >> 8;
    const b = hash & 0x0000FF;
    return "#" + ("0" + r.toString(16)).substr(-2) + ("0" + g.toString(16)).substr(-2) + ("0" + b.toString(16)).substr(-2);
  }

  // getRGB(str: string){
  //   var hash = $.md5(str);
  //   var rgb = '#' + hash.substring(0,2) + hash.substring(2,4) + hash.substring(4,6);
  //   return rgb;
  // }
}
