import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {MatDialog} from '@angular/material';

import {CafetService, CafetUser} from '../cafet-service/cafet.service';
import {DicoService} from '../../language/dico.service';
import {CafetHistoryComponent} from '../cafet-history/cafet-history.component';

@Component({
  selector: 'app-cafet',
  templateUrl: './cafet.component.html',
  styleUrls: ['./cafet.component.css']
})
export class CafetComponent implements OnInit, OnDestroy {

  // creditError: string;
  // ingredients: {[group: string]: Ingredient[]};
  // weekIngredients: Ingredient[];

  // ingredientsWatcher: any;

  constructor(
    private dialog: MatDialog,

    public cafet: CafetService,
    public d: DicoService,
    public location: Location
  ) { }

  ngOnInit() {
    // this.ingredientsWatcher = this.watchIngredients();
  }

  ngOnDestroy() {
    // this.ingredientsWatcher.unsubscribe();
  }

  /*watchIngredients() {
    return this.cafet.getIngredients().subscribe(ingredients => {
      this.ingredients = {};
      for (let group of this.cafet.ingrGroups) {
        this.ingredients[group] = ingredients.filter(
          ingredient => ingredient.group === group
        );
      }
      this.weekIngredients = ingredients.filter(
        ingredient => ingredient.ofTheWeek == true
      );
    });
  }*/

  openHistory(user: CafetUser): void {
      this.dialog.open(CafetHistoryComponent, {
        data: {user: user, day: false},
        width: '450px'
      });
  }
}
