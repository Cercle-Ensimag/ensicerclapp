import { Component } from '@angular/core';

const TEXT: string = "A voté !";
const ICON: string = "mail";

@Component({
  selector: 'app-vote-snackbar',
  templateUrl: './vote-snackbar.component.html',
  styleUrls: ['./vote-snackbar.component.css']
})
export class VoteSnackbarComponent {
  text: string;
  icon: string;

  constructor () {
    this.text = TEXT;
    this.icon = ICON;
  }
}
