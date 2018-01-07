import { Injectable } from '@angular/core';

@Injectable()
export class CafetService {

  credit: number;

  constructor() {
    this.credit = -1.3;
  }

}
