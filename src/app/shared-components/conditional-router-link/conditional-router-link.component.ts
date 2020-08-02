import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-conditional-router-link',
	templateUrl: './conditional-router-link.component.html',
	styleUrls: ['./conditional-router-link.component.css']
})
export class ConditionalRouterLinkComponent implements OnInit {

	@Input() public enabled: boolean = false;
	@Input() public link: string = '';

	constructor() { }

	ngOnInit() { }

}
