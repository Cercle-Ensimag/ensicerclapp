import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { ToolsService } from '../providers/tools.service';

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

  annonces: NsigmaAnnonce[];
  nsigmaAnnoncesWatcher: any;

  constructor(
    private db: AngularFireDatabase,
    private tools: ToolsService
  ) {
  }

  start() {
    if (this.nsigmaAnnoncesWatcher) {
      this.stop();
    }
    this.nsigmaAnnoncesWatcher = this.watchNsigmaAnnonces();
  }

  stop() {
    if (this.nsigmaAnnoncesWatcher) {
      this.nsigmaAnnoncesWatcher.unsubscribe();
      this.nsigmaAnnoncesWatcher = null;
    }
  }

  watchNsigmaAnnonces() {
    return this.db.list<NsigmaAnnonce>('nsigma/annonces').valueChanges().subscribe(
      nsigmaAnnonces => {
        this.annonces = nsigmaAnnonces.reverse() || [];
      },
      err => {
      }
    );
  }

  getNsigmaAnnonce(nsigmaAnnonceId: string) {
    return this.db.object<NsigmaAnnonce>('nsigma/annonces/' + nsigmaAnnonceId).valueChanges();
  }

  getNsigmaAnnonceId() {
    return this.db.list<NsigmaAnnonce>('nsigma/annonces/').push(null).key;
  }

  setNsigmaAnnonce(nsigmaAnnonce: NsigmaAnnonce) {
    return this.db.object<NsigmaAnnonce>('nsigma/annonces/' + nsigmaAnnonce.id).set(nsigmaAnnonce);
  }

  deleteNsigmaAnnonce(nsigmaAnnonceId: number) {
    return this.db.object<NsigmaAnnonce>('nsigma/annonces/' + nsigmaAnnonceId).set(null);
  }
}
