import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Tools } from '../providers/tools.service';

export class NsigmaJobAd {
	id: string;
	title: string;
	description: string;
	type: number;
	start: number;
	end: number;
	technologies: string;
	difficulty: string;
	remuneration: number;
	form: string;
	done: boolean;
}

@Injectable()
export class NsigmaService {
	private _jobads: Observable<NsigmaJobAd[]>;
	private _jobad: { [ $jobadId: string ]: Observable<NsigmaJobAd> } = {};

	constructor(
		private db: AngularFireDatabase
	) { }

	getJobAds(): Observable<NsigmaJobAd[]> {
		if (!this._jobads){
			this._jobads = Tools.enableCache(
				this.db.list<NsigmaJobAd>('nsigma/jobads').valueChanges(),
				'nsigma'
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
		return this.db.list<NsigmaJobAd>('nsigma/jobads/').push(null).key;
	}

	setJobAd(nsigmaJobAd: NsigmaJobAd) {
		return this.db.object<NsigmaJobAd>('nsigma/jobads/' + nsigmaJobAd.id).set(nsigmaJobAd);
	}

	deleteJobAd(nsigmaJobAdId: string) {
		return this.db.object<NsigmaJobAd>('nsigma/jobads/' + nsigmaJobAdId).set(null);
	}
}
