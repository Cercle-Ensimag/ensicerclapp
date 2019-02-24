import {FormControl} from '@angular/forms';
import {Observable, merge, of, EMPTY} from 'rxjs';
import {map, tap} from 'rxjs/operators';

import * as CryptoJS from 'crypto-js';

export class Tools {

	constructor() { }

	// Turn an observable into a cached observable (use only if results can be stored as JSON)
	static enableCache(toCache: Observable<any>, identifier: string, json: boolean = true, mapTo: Function = null) {
		return merge(
			toCache.pipe(
				tap(result => {
					try {
						localStorage.setItem(identifier, json ? JSON.stringify(result) : result);
					} catch(err) {
						console.log(err);
					}
				})
			),
			localStorage.getItem(identifier) ? of(
				json ? (
					mapTo ? JSON.parse(localStorage.getItem(identifier)).map(mapTo) : JSON.parse(localStorage.getItem(identifier))
				) : localStorage.getItem(identifier)
			) : EMPTY
		);
	}


	static getEmailIdFromEmail(email: string) {
		return email.toLowerCase().split("@")[0].replace('.', '|');
	}

	static getNameFromEmailId(emailId: string): string {
		// TODO: handle number in email ?
		return this.titleCase(emailId.replace('|', ' ').replace('	', ' '));
	}

	static titleCase(str) {
		str = str.toLowerCase().split(' ');
		for (let i = 0; i < str.length; i++) {
			str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
		}
		return str.join(' ');
	}

	static urlValidator(control: FormControl) {
		if (!control.value.match(/^http(s)?:\/\//)){
			return { error: true };
		}
		return null;
	}

	static timeValidator(control: FormControl) {
		if (!control.value.match(/^[0-9][0-9]:[0-9][0-9]$/)){
			return { error: true };
		}
		return null;
	}

	static dateValidator() {
		/*
		if (!control.value.toString().match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ([0-2][0-9]|3[0-2]) 20[1-9][0-9]/)){
			return { error: true };
		}
		*/
		return null;
	}

	static getTimeFromDate(date: any) {
		if (!date) {
			return '';
		}
		return (new Date(date)).toString().split(' ')[4].substring(0, 5);
	}

	static setDayTime(date: number, time: string) {
		let daySp = (new Date(date)).toString().split(" ");
		daySp[4] = time;
		return (new Date(daySp.join(" "))).getTime();
	}

	static round(number: number, precision: number) {
		const factor = Math.pow(10, precision);
		const tempNumber = number * factor;
		const roundedTempNumber = Math.round(tempNumber);
		return roundedTempNumber / factor;
	}

	// TODO: Transform to pipe.
	static truncate(sentence: string, maxLength: number = 100): string {
		return sentence.slice(0, maxLength) + (sentence.length > 100 ? '...' : '');
	}

	// TODO: use color in calendar view ?
	static getRGB(str: string): string {
		var hash = CryptoJS.MD5(str).toString();
		var rgb = '#' + hash.substring(0,2) + hash.substring(2,4) + hash.substring(4,6);
		return rgb;
	}

	static cipher(message: string, key: string): string {
		return CryptoJS.AES.encrypt(message, key).toString();
	}

	static decipher(code: string, key: string): string {
		try {
			return CryptoJS.AES.decrypt(code, key).toString(CryptoJS.enc.Utf8);
		} catch {
			return null;
		}
	}

	static generateKey(passwd: string, salt: string): string {
		return CryptoJS.PBKDF2(passwd, salt, {
			keySize: 256/32,
			hasher: CryptoJS.algo.SHA256,
			iterations: 12042
		}).toString();
	}

	static generateSalt(): string {
		return CryptoJS.lib.WordArray.random(256/8).toString();
	}

	static hashKey(key: string): string {
		return CryptoJS.SHA256(key).toString();
	}

	static storeKey(key: string) {
		localStorage.setItem("cal-key", key);
	}

	static loadKey(): string {
		return localStorage.getItem("cal-key");
	}

	static storeLanguage(country: string) {
		localStorage.setItem("language", country);
	}

	static loadLanguage(): string {
		return localStorage.getItem("language");
	}

}
