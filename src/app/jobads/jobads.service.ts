import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {Tools} from '../providers/tools.service';

export class JobAd {
	id: string;
	title: string;
	description: string;
	type: number;
	start: number;
	length: string;
	technologies: string;
	contact: string;
	author: string;
	done: boolean;
}

@Injectable()
export class JobAdsService {
	private _jobads: Observable<JobAd[]>;
	private _jobad: { [ $jobadId: string ]: Observable<JobAd> } = {};

	constructor(
		private db: AngularFireDatabase
	) { }

	getJobAds(): Observable<JobAd[]> {
		if (!this._jobads){
			this._jobads = Tools.enableCache(
				this.db.list<JobAd>('jobads/jobads').valueChanges(),
				'jobads'
			).pipe(
				map(jobads => jobads.reverse()),
				shareReplay(1)
			);
		}
		return this._jobads;
	}

	getJobAd(jobadId: string) {
		if (!this._jobad[jobadId]) {
			this._jobad[jobadId] = this.getJobAds().pipe(
				map(jobads => jobads.find(jobad => jobad.id == jobadId)),
				shareReplay(1)
			);
		}
		return this._jobad[jobadId];
	}

	getJobAdId() {
		return this.db.list<JobAd>('/jobads/jobads/').push(null).key;
	}

	setJobAd(jobad: JobAd) {
		return this.db.object<JobAd>('/jobads/jobads/' + jobad.id).set(jobad);
	}

	deleteJobAd(jobadId: string) {
		return this.db.object<JobAd>('/jobads/jobads/' + jobadId).set(null);
	}
}
