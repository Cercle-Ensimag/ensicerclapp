import { Injectable } from '@angular/core';

import { English } from './english';

@Injectable()
export class DicoService {

  l: any;

  constructor() {
    this.l = English;
  }

}
