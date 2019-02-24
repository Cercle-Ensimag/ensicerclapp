import { Injectable } from '@angular/core';
import { Tools } from '../providers/tools.service';

import { Language } from './language';
import { French } from './french';

@Injectable()
export class DicoService {

	l: Language;

	constructor() {
		let country = Tools.loadLanguage();
		if (country) {
			this.setLanguage(country);
		} else {
			this.setLanguage("fr");
		}
	}

	setLanguage(country: string) {
		switch (country) {
			case "fr":
				this.l = new French();
				break;
			default:
				throw "Not implemented";
		}
		Tools.storeLanguage(country);
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
