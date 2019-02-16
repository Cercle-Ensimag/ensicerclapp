import { Injectable } from '@angular/core';

import { French } from './french';

@Injectable()
export class DicoService {

	l: any;

	constructor() {
		this.l = French;
	}

	format(expr: string, ...args: string[]): string {
		return expr.replace(
			/{(\d+)}/g,
			function(match, number) {
				return typeof args[number] != 'undefined' ? args[number] : match;
			}
		);
	}

}
