import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

declare var ga: Function;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

	constructor (
		private router: Router
	) { }


	ngOnInit( ) {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				ga('set', 'page', event.urlAfterRedirects);
				ga('send', 'pageview');
			}
		});
	}
}
