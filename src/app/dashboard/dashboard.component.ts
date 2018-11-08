import { Component, OnInit } from '@angular/core';

import { AppModulesService, AppModule } from '../providers/app-modules.service';
import { DeviceSizeService } from '../providers/device-size.service';
import { EventsService } from '../events/events-service/events.service';
import { CalService } from '../calendar/cal-service/cal.service';
import { ActusService } from '../actus/actus-service/actus.service';
import { JobAdsService } from '../jobads/jobads.service';
import { NsigmaService } from '../nsigma/nsigma.service';
import { VoteService } from '../vote/vote-service/vote.service';
import { Observable, pipe, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	private _contentObs: { [modName: string]: Observable<string[]> } = {};

  constructor(
		private events: EventsService,
		private cal: CalService,
		private actus: ActusService,
		private jobads: JobAdsService,
		private nsigma: NsigmaService,
		private votes: VoteService,
    public modules: AppModulesService,
    public media: DeviceSizeService
  ) {}

  ngOnInit() {
	}

	getContent(modName: string): Observable<string[]>{
		if (!this._contentObs[modName]) {
			if (modName === "events") {
				this._contentObs[modName] = this.getEvents();
			} else if (modName=="calendar") {
				this._contentObs[modName] = this.getCalendar();
			} else if (modName=="actus") {
				this._contentObs[modName] = this.getActus();
			} else if (modName=="jobads") {
				this._contentObs[modName] = this.getJobAds();
			} else if (modName=="nsigma") {
				this._contentObs[modName] = this.getNsigma();
			} else if (modName === "votes") {
				this._contentObs[modName] = this.getVotes();
			} else {
				this._contentObs[modName] = of([]);
			}
		}
		return this._contentObs[modName];
	}

	getEvents() {
		return this.events.getActiveEvents().pipe(
			map(events => events.map(event => event.title))
			// TODO: random sort among events of the week ?
		);
	}

	getCalendar() {
		return of([]);
	}

	getActus() {
		return this.actus.getActus().pipe(
			map(actus => actus.map(actu => actu.title))
		);
	}

	getJobAds() {
		return this.jobads.getJobAds().pipe(
			map(jobads => jobads.map(jobad => jobad.title))
		);
	}

	getNsigma() {
		return this.nsigma.getJobAds().pipe(
			map(jobads => jobads.map(jobad => jobad.title))
		);
	}

	getVotes() {
		return this.votes.getStartedPolls().pipe(
			map(polls => polls.map(poll => poll.title))
		);
	}

	getModules(): Observable<AppModule[]> {
		return this.modules.getAppModules();
	}

}
