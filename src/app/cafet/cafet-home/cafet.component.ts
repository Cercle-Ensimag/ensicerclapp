import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';

import { CafetService, Ingredient } from '../cafet-service/cafet.service';
import { DicoService } from '../../language/dico.service';
import { CafetHistoryComponent } from '../cafet-history/cafet-history.component';

@Component({
  selector: 'app-cafet',
  templateUrl: './cafet.component.html',
  styleUrls: ['./cafet.component.css']
})
export class CafetComponent implements OnInit, OnDestroy {

  creditError: string;
  ingredients: {[group: string]: Ingredient[]};
  weekIngredients: Ingredient[];

  ingredientsWatcher: any;

  constructor(
    public cafet: CafetService,
    public dialog: MatDialog,
    public d: DicoService
  ) { }

  ngOnInit() {
    this.cafet.start();
    this.ingredientsWatcher = this.watchIngredients();
  }

  ngOnDestroy() {
    this.cafet.stop();
    this.ingredientsWatcher.unsubscribe();
  }

  watchIngredients() {
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
  }

  isCreditError(): boolean {
    if (this.cafet.user.credit < 0) {
      this.creditError = this.d.l.negativeCreditError;
      return true;
    } else {
      this.creditError = null;
      return false;
    }
  }

  getCreditError(): string {
    return this.creditError;
  }

  openHistory(): void {
    let dialogRef = this.dialog.open(CafetHistoryComponent, {
      data: this.cafet.user,
      width: '450px'
    });
  }

}
