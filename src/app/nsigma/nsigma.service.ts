import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {ToolsService} from '../providers/tools.service';

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
    private db: AngularFireDatabase,
    private tools: ToolsService) { }

  getJobAds(): Observable<NsigmaJobAd[]> {
    if (!this._jobads){
      this._jobads = this.tools.enableCache(
        this.db
          .list<NsigmaJobAd>('nsigma/jobads')
          .valueChanges(), '_jobadsNsigma')
        .pipe(
          map(jobads => jobads.reverse()),
          shareReplay(1));
    }
    return this._jobads;
  }

  getJobAd(nsigmaJobAdId: string) {
    if (!this._jobad[nsigmaJobAdId]){
      this._jobad[nsigmaJobAdId] = this.tools.enableCache(
        this.db
          .object<NsigmaJobAd>('nsigma/jobads/' + nsigmaJobAdId)
          .valueChanges(), `_jobadNsigma_${nsigmaJobAdId}`)
        .pipe(shareReplay(1))
    }
    return this._jobad[nsigmaJobAdId];
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
