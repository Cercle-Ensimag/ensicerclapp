import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireDatabase } from 'angularfire2/database';

import { AuthService } from '../../auth/auth-service/auth.service';

import * as parseICS from 'ics-parser';

const LINK = "https://edt.grenoble-inp.fr/directCal/2017-2018/exterieur?resources=15711,14992,14225,14226,14223,16819,17042,14239,14240,16612,16450,13769,13772,13753,13750,3222,16303,13880,14123,14129,14175,14059,16319,16317,17131,17184,16336,16404,17048,14204,14202,14208,14220,14221,14218,17025,17028,17026,18750,18746,13680,13682,13679,18346,13188,13193,16881,16880,16989,12957,13107,13078,13094,18828,18827,18023,17925,17921,18339,18768,10341,8527,8769";

export class CalEvent {
  description: string;
  end: string;
  endDate: string;
  location: string;
  name: string;
  startDate: string;
  type: string;
  uid: string;
}

@Injectable()
export class CalService {

  events: CalEvent[] = [];
  eventsWatcher: any;

  constructor(
    private auth: AuthService,
    private db: AngularFireDatabase,
    private http: HttpClient
  ) { }

  start () {
    if (this.eventsWatcher) {
      this.stop();
    }
    this.eventsWatcher = this.watchEvents();
  }

  stop() {
    if (this.eventsWatcher) {
      this.eventsWatcher.unsubscribe();
      this.eventsWatcher = null;
    }
  }

  watchEvents() {
    return this.http.get(LINK).subscribe(
      cal => {
        this.events = parseICS(cal);
      },
      err => { console.log(err); }
    )
  }
}
