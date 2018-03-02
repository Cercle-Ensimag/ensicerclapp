import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireDatabase } from 'angularfire2/database';

import { AuthService } from '../../auth/auth-service/auth.service';
import { EventsService } from '../../events/events-service/events.service';
import { Event } from '../../events/events-home/events-home.component';

import * as parseICS from 'ics-parser';

const LINK = "https://edt.grenoble-inp.fr/directCal/2017-2018/exterieur?resources=15711,14992,14225,14226,14223,16819,17042,14239,14240,16612,16450,13769,13772,13753,13750,3222,16303,13880,14123,14129,14175,14059,16319,16317,17131,17184,16336,16404,17048,14204,14202,14208,14220,14221,14218,17025,17028,17026,18750,18746,13680,13682,13679,18346,13188,13193,16881,16880,16989,12957,13107,13078,13094,18828,18827,18023,17925,17921,18339,18768,10341,8527,8769";

const CAL =
"BEGIN:VCALENDAR\n\
METHOD:REQUEST\n\
PRODID:-//ADE/version 6.0\n\
VERSION:2.0\n\
CALSCALE:GREGORIAN\n\
BEGIN:VEVENT\n\
DTSTAMP:20180302T002352Z\n\
DTSTART:20180327T091500Z\n\
DTEND:20180327T104500Z\n\
SUMMARY:Analyse\, concep. objet de log. emb.\n\
LOCATION:D207 (V)\n\
DESCRIPTION:\n4MMACLE_2017_S4_Permanence_G1\n(Exporté le:02/03/2018 01:23\
 )\n\
UID:ADE60456d706c6f69647574656d7073323031372f323031382d32373330352d312d30\n\
 \n\
CREATED:19700101T000000Z\n\
LAST-MODIFIED:20180302T002352Z\n\
SEQUENCE:1806105032\n\
END:VEVENT\n\
BEGIN:VEVENT\n\
DTSTAMP:20180302T002352Z\n\
DTSTART:20180302T071500Z\n\
DTEND:20180302T084500Z\n\
SUMMARY:Projet de conception d'OS - approf.\n\
LOCATION:E200-info (V) 40PC LinWin OpenGL Office 16Go\n\
DESCRIPTION:\n4MMPCSEA_2017_S4_TD_G2\n(Exporté le:02/03/2018 01:23)\n\
UID:ADE60456d706c6f69647574656d7073323031372f323031382d32373438322d31322d\
 30\n\
CREATED:19700101T000000Z\n\
LAST-MODIFIED:20180302T002352Z\n\
SEQUENCE:1806105032\n\
END:VEVENT\n\
BEGIN:VEVENT\n\
DTSTAMP:20180302T002352Z\n\
DTSTART:20180315T071500Z\n\
DTEND:20180315T084500Z\n\
SUMMARY:Anglais\n\
LOCATION:D109 (V)\n\
DESCRIPTION:\n4MMANGS2_2017_S4_TD_G2\n(Exporté le:02/03/2018 01:23)\n\
UID:ADE60456d706c6f69647574656d7073323031372f323031382d32373332372d342d30\n\
 \n\
CREATED:19700101T000000Z\n\
LAST-MODIFIED:20180302T002352Z\n\
SEQUENCE:1806105032\n\
END:VEVENT\n\
BEGIN:VEVENT\n\
DTSTAMP:20180302T002352Z\n\
DTSTART:20180313T084500Z\n\
DTEND:20180313T114500Z\n\
SUMMARY:Analyse\, concep. objet de log. emb.\n\
LOCATION:D207 (V)\n\
DESCRIPTION:\n4MMACLE_2017_S4_CM_G1\n(Exporté le:02/03/2018 01:23)\n\
UID:ADE60456d706c6f69647574656d7073323031372f323031382d32373330342d312d30\n\
 \n\
CREATED:19700101T000000Z\n\
LAST-MODIFIED:20180302T002352Z\n\
SEQUENCE:1806105032\n\
END:VEVENT\n\
BEGIN:VEVENT\n\
DTSTAMP:20180302T002352Z\n\
DTSTART:20180313T150000Z\n\
DTEND:20180313T170000Z\n\
SUMMARY:Sport\n\
LOCATION:SIUAPS-Campus-CSU (Piscine universitaire)\n\
DESCRIPTION:\n4MMEPSS2_2017_S4_TD_G1\n(Exporté le:02/03/2018 01:23)\n\
UID:ADE60456d706c6f69647574656d7073323031372f323031382d32373439312d342d30\n\
 \n\
CREATED:19700101T000000Z\n\
LAST-MODIFIED:20180302T002352Z\n\
SEQUENCE:1806105032\n\
END:VEVENT\n\
BEGIN:VEVENT\n\
DTSTAMP:20180302T002352Z\n\
DTSTART:20180312T143000Z\n\
DTEND:20180312T160000Z\n\
SUMMARY:Principes des systemes de gestion de bases de donnees\n\
LOCATION:D207 (V)\n\
DESCRIPTION:\n4MMPSGS2_2017_S4_TD_G1\n(Exporté le:02/03/2018 01:23)\n\
UID:ADE60456d706c6f69647574656d7073323031372f323031382d32373437312d362d30\n\
 \n\
CREATED:19700101T000000Z\n\
LAST-MODIFIED:20180302T002352Z\n\
SEQUENCE:1806105032\n\
END:VEVENT\n\
BEGIN:VEVENT\n\
DTSTAMP:20180302T002352Z\n\
DTSTART:20180319T160000Z\n\
DTEND:20180319T173000Z\n\
SUMMARY:Introduction aux systemes d'exploitation temps-reel\n\
LOCATION:D211 (V)\n\
DESCRIPTION:\n4MMISET7_2017_S4_CM_G1\n(Exporté le:02/03/2018 01:23)\n\
UID:ADE60456d706c6f69647574656d7073323031372f323031382d32373431302d342d30\n\
 \n\
CREATED:19700101T000000Z\n\
LAST-MODIFIED:20180302T002352Z\n\
SEQUENCE:1806105032\n\
END:VEVENT\n\
BEGIN:VEVENT\n\
DTSTAMP:20180302T002352Z\n\
DTSTART:20180305T130000Z\n\
DTEND:20180305T143000Z\n\
SUMMARY:Principes des systemes de gestion de bases de donnees\n\
LOCATION:D109 (V)\n\
DESCRIPTION:\n4MMPSGS2_2017_S4_CTD2_G1\n(Exporté le:02/03/2018 01:23)\n\
UID:ADE60456d706c6f69647574656d7073323031372f323031382d32373436362d302d30\n\
 \n\
CREATED:19700101T000000Z\n\
LAST-MODIFIED:20180302T002352Z\n\
SEQUENCE:1806105032\n\
END:VEVENT\n\
BEGIN:VEVENT\n\
DTSTAMP:20180302T002352Z\n\
DTSTART:20180330T120000Z\n\
DTEND:20180330T150000Z\n\
SUMMARY:Module innovation\n\
LOCATION:D207 (V)\n\
DESCRIPTION:\n4MMINNO_2017_S4_TD_G4\n(Exporté le:02/03/2018 01:23)\n\
UID:ADE60456d706c6f69647574656d7073323031372f323031382d32373434362d342d30\n\
 \n\
CREATED:19700101T000000Z\n\
LAST-MODIFIED:20180302T002352Z\n\
SEQUENCE:1806105032\n\
END:VEVENT\n\
BEGIN:VEVENT\n\
DTSTAMP:20180302T002352Z\n\
DTSTART:20180309T130000Z\n\
DTEND:20180309T160000Z\n\
SUMMARY:Module innovation\n\
LOCATION:E012-Amphi E (V)\n\
DESCRIPTION:\n4MMINNO_2017_S4_CM_G2\n(Exporté le:02/03/2018 01:23)\n\
UID:ADE60456d706c6f69647574656d7073323031372f323031382d32373434312d312d30\n\
 \n\
CREATED:19700101T000000Z\n\
LAST-MODIFIED:20180302T002352Z\n\
SEQUENCE:1806105032\n\
END:VEVENT\n\
END:VCALENDAR"

export class CalEvent {
  uid: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  // description: string;
  // type: string;
  // end: string;

  constructor(id, name, start, end, loc) {
    this.uid = id;
    this.name = name;
    this.startDate = start;
    this.endDate = end;
    this.location = loc;
  }
}

class AssoEventIds {
  [eventId: string]: string;
}

@Injectable()
export class CalService {

  calEvents: CalEvent[] = [];

  courses: CalEvent[] = [];
  assos: CalEvent[] = [];
  persos: CalEvent[] = [];

  assosEventsIds: AssoEventIds = {};

  coursesWatcher: any;
  assosWatcher: any;
  assosEventsIdsWatcher: any;
  persosWatcher: any;

  constructor(
    private auth: AuthService,
    private db: AngularFireDatabase,
    private events: EventsService,
    private http: HttpClient
  ) { }

  start () {
    if (this.coursesWatcher) {
      this.stop();
    }
    this.coursesWatcher = this.watchCoursesEvents();
  }

  stop() {
    if (this.coursesWatcher) {
      this.coursesWatcher.unsubscribe();
      this.coursesWatcher = null;
    }
  }

  watchCoursesEvents() {
    this.courses = parseICS(CAL);
    this.concatEvents();
    return null;
    // return this.http.get(LINK).subscribe(
    //   cal => {
    //     this.events = parseICS(cal);
    //   },
    //   err => { console.log(err); }
    // )
  }

  watchAssosEvents() {
    return this.events.getEvents().subscribe(
      events => {
        this.assos = events.map(event => new CalEvent(
          event.id, event.title, event.start, event.end, event.location
        )) || [];
        this.concatEvents();
      },
      err => {}
    );
  }

  watchAssosEventsIds() {
    return this.db.object<AssoEventIds>('calendar/users/'+this.auth.getEmailId()+'/assos').valueChanges().subscribe(
      ids => {
        this.assosEventsIds = ids;
        this.concatEvents();
      },
      err => {}
    )
  }

  watchPersoEvents() {
    return this.db.list<CalEvent>('calendar/users/'+this.auth.getEmailId()+'/perso').valueChanges().subscribe(
      events => {
        this.persos = events;
        this.concatEvents();
      },
      err => {}
    )
  }

  concatEvents() {
    this.calEvents = this.courses.concat(this.persos).concat(
      this.assos.filter(event => event.uid === this.assosEventsIds[event.uid])
    );
  }
}
