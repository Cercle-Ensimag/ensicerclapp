import { Injectable } from '@angular/core';

import { English } from './english';
import { French } from './french';

@Injectable()
export class DicoService {

  l: any;

  constructor() {
    this.l = French;
  }

}
