import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';

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
    private db: AngularFireDatabase) { }

  getAnnonces(): Observable<NsigmaAnnonce[]> {
    if (!this._annonces){
      this._annonces = this.db
        .list<NsigmaAnnonce>('nsigma/annonces')
        .valueChanges()
        .pipe(
          map(annonces => annonces.reverse()),
          shareReplay(1));
    }
    return this._annonces;
  }

  getAnnonce(nsigmaAnnonceId: string) {
    if (!this._annonce[nsigmaAnnonceId]){
      this._annonce[nsigmaAnnonceId] = this.db
        .object<NsigmaAnnonce>('nsigma/annonces/' + nsigmaAnnonceId)
        .valueChanges()
        .pipe(shareReplay(1))
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
