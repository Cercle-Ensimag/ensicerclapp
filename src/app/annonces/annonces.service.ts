import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {ToolsService} from '../providers/tools.service';

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
    private tools: ToolsService
  ) { }

  getAnnonces(): Observable<Annonce[]> {
    if (!this._annonces){
      this._annonces = this.tools.enableCache(
          this.db
          .list<Annonce>('annonces/annonces')
          .valueChanges(), '_annonces')
        .pipe(
          map(annonces => annonces.reverse()),
          shareReplay(1));
    }
    return this._annonces;
  }

  getAnnonce(annonceId: string) {
    if (!this._annonce[annonceId]) {
      this._annonce[annonceId] = this.tools.enableCache(
        this.db
          .object<Annonce>('/annonces/annonces/' + annonceId)
          .valueChanges(), `_annonce_${annonceId}`)
        .pipe(shareReplay(1));
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
