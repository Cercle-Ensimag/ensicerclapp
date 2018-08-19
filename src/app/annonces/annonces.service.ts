import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { ToolsService } from '../providers/tools.service';

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

  annonces: Annonce[];
  annoncesWatcher: any;

  constructor(
    private db: AngularFireDatabase,
    private tools: ToolsService
  ) {
  }

  start() {
    if (this.annoncesWatcher) {
      this.stop();
    }
    this.annoncesWatcher = this.watchAnnonces();
  }

  stop() {
    if (this.annoncesWatcher) {
      this.annoncesWatcher.unsubscribe();
      this.annoncesWatcher = null;
    }
  }

  watchAnnonces() {
    return this.db.list<Annonce>('/annonces/annonces').valueChanges().subscribe(
      annonces => {
        this.annonces = annonces.reverse() || [];
      },
      err => {
      }
    );
  }

  getAnnonce(annonceId: string) {
    return this.db.object<Annonce>('/annonces/annonces/' + annonceId).valueChanges();
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
