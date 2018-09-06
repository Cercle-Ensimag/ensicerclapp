import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';

import {ToolsService} from '../providers/tools.service';
import {Observable} from '../../../node_modules/rxjs';

export class NsigmaAnnonce {
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
  private _annonces: Observable<NsigmaAnnonce[]>;
  private _annonce: { [ $annonceId: string ]: Observable<NsigmaAnnonce> } = {};

  constructor(
    private db: AngularFireDatabase,
    private tools: ToolsService
  ) { }

  getAnnonces(): Observable<NsigmaAnnonce[]> {
    if (!this._annonces){
      this._annonces = this.db
        .list<NsigmaAnnonce>('nsigma/annonces')
        .valueChanges()
        .map(annonces => annonces.reverse())
        .shareReplay(1);
    }
    return this._annonces;
  }

  getAnnonce(nsigmaAnnonceId: string) {
    if (!this._annonce[nsigmaAnnonceId]){
      this._annonce[nsigmaAnnonceId] = this.db
        .object<NsigmaAnnonce>('nsigma/annonces/' + nsigmaAnnonceId)
        .valueChanges()
        .shareReplay(1)
    }
    return this._annonce[nsigmaAnnonceId];
  }

  getAnnonceId() {
    return this.db.list<NsigmaAnnonce>('nsigma/annonces/').push(null).key;
  }

  setAnnonce(nsigmaAnnonce: NsigmaAnnonce) {
    return this.db.object<NsigmaAnnonce>('nsigma/annonces/' + nsigmaAnnonce.id).set(nsigmaAnnonce);
  }

  deleteAnnonce(nsigmaAnnonceId: string) {
    return this.db.object<NsigmaAnnonce>('nsigma/annonces/' + nsigmaAnnonceId).set(null);
  }
}
