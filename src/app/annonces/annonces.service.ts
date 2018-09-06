import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from '../../../node_modules/rxjs';

export class Annonce {
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
export class AnnoncesService {
  private _annonces: Observable<Annonce[]>;
  private _annonce: { [ $annonceId: string ]: Observable<Annonce> } = {};

  constructor(
    private db: AngularFireDatabase,
  ) { }

  getAnnonces(): Observable<Annonce[]> {
    if (!this._annonces){
      this._annonces = this.db
        .list<Annonce>('annonces/annonces')
        .valueChanges()
        .map(annonces => annonces.reverse())
        .shareReplay(1);
    }
    return this._annonces;
  }

  getAnnonce(annonceId: string) {
    if (!this._annonce[annonceId]) {
      this._annonce[annonceId] = this.db
        .object<Annonce>('/annonces/annonces/' + annonceId)
        .valueChanges()
        .shareReplay(1);
    }
    return this._annonce[annonceId];
  }

  getAnnonceId() {
    return this.db.list<Annonce>('/annonces/annonces/').push(null).key;
  }

  setAnnonce(annonce: Annonce) {
    return this.db.object<Annonce>('/annonces/annonces/' + annonce.id).set(annonce);
  }

  deleteAnnonce(annonceId: string) {
    return this.db.object<Annonce>('/annonces/annonces/' + annonceId).set(null);
  }
}
