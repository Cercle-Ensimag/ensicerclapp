import { Injectable, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AbstractControl, FormControl } from '@angular/forms';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { combineLatest, from, Observable, Observer, of, EMPTY } from 'rxjs';
import { catchError, debounceTime, filter, first, flatMap, map, mergeMap, shareReplay, tap } from 'rxjs/operators';
import * as firebase from 'firebase';
import { User } from 'firebase/app';

import { Tools } from '../../providers/tools.service';
import { DicoService } from '../../language/dico.service';

import { ComResp } from '../../events/events-service/events.service';
import { Journalist } from '../../actus/actus-service/actus.service';
import { Assessor } from '../../vote/vote-admin/vote-admin.component';
import { CafetResp } from '../../cafet/cafet-service/cafet.service';

import { environment } from '../../../environments/environment';

export const DOMAINS = ['grenoble-inp.org'];
export const ADMINS = ['vote', 'events', 'actus', 'cafet', 'nsigma', 'jobads'];

export class Profile {
	name: {
		firstName: string,
		lastName: string,
		login: string
	};
	photoURL: string;

	constructor(fn: string, ln: string, lg: string, img: string) {
		this.name = {
			firstName: fn,
			lastName: ln,
			login: lg
		};
		this.photoURL = img;
	}
}

export class SimpleUser {
	// uid: string;
	// displayName: string;
	// photoURL: string;
	// email: string;
	emailVerified: boolean;
	// lastLoginAt: string;
	// createdAt: string;
}

@Injectable()
export class AuthService {
	error: any;
	error_persist: boolean;

	private _adminsRes: Observable<string> = null;
	private _otherAdminsRes: Observable<string> = null;
	private _assessorRes: Observable<Assessor> = null;
	private _cafetRespRes: Observable<CafetResp> = null;
	private _journalistRes: Observable<Journalist> = null;
	private _comRespRes: Observable<ComResp> = null;

	private _user: Observable<firebase.User> = null;
	private _loggedUser: Observable<firebase.User> = null;
	private _simpleUser: Observable<SimpleUser> = null;
	private _profile: Observable<Profile> = null;

	private _isAdmin: Observable<boolean> = null;
	private _isAdminOf: { [of: string]: Observable<boolean> } = {};
	private _isAssessor: Observable<boolean>;
	private _isCafetResp: Observable<boolean>;
	private _respComIds: Observable<string[]>;
	private _journalistIds: Observable<string[]>;
	private _isLogged: Observable<boolean>;
	private _isLoggedAndHasEmailVerified: Observable<boolean>;
	private _connectionEstablished: Observable<boolean>;
	private _offline: Observable<boolean>;

	constructor(
		private afAuth: AngularFireAuth,
		private db: AngularFireDatabase,
		private router: Router,
		private location: Location,
		private d: DicoService,
		private ngZone: NgZone
	) {
		this.error_persist = false;
		this.afAuth.onIdTokenChanged((user: firebase.User) => this.redirectOnTokenChange(user));
	}

	redirectOnTokenChange(user: firebase.User): void {
		// Not logged
		if (!user) {
			if (this.location.path() !== '/email_verif') {
				this.goToLogin();
			}
			return;
		}

		// Logged
		if (!user.emailVerified && this.location.path() !== '/email_verif') {
			this.goToEmailVerif();
			return;
		}

		let paths = ['/login', '/signup', '/email_verif', '/password_reset'];
		if (user.emailVerified && paths.includes(this.location.path())) {
			this.goToHome();
		}

	}

	// Methods

	login(email: string, password: string): Promise<firebase.auth.UserCredential> {
		return this.afAuth.signInWithEmailAndPassword(email, password);
	}

	logout(): Promise<void> {
		return this.afAuth.signOut();
	}

	createAccount(
		email: string, password: string, firstName: string, lastName: string
	): Promise<[firebase.User, Promise<void>, Promise<void>, Promise<void>]> {
		return this.afAuth.createUserWithEmailAndPassword(email, password).then(
			(uc: firebase.auth.UserCredential) => {
				return [
					uc.user,
					this.sendEmailVerification(uc.user),
					this.setProfile(uc.user, firstName, lastName),
					this.updateProfileFromUser(uc.user, new Profile(firstName, lastName, '', ''))
				];
			}
		);
	}

	deleteAccount(): Promise<void> {
		return this.getLoggedUser().pipe(
			first(),
			flatMap((user: firebase.User) => from(user.delete()))
		).toPromise();
	}

	updatePassword(password: string): Promise<void> {
		return this.getLoggedUser().pipe(
			first(),
			flatMap((user: firebase.User) => from(user.updatePassword(password)))
		).toPromise();
	}

	updateProfile(p: Profile): Promise<void> {
		return this.getLoggedUser().pipe(
			first(),
			flatMap((user: firebase.User) => from(this.updateProfileFromUser(user, p)))
		).toPromise();
	}

	setProfile(user: firebase.User, firstName: string, lastName: string): Promise<void> {
		return user.updateProfile({
			displayName: firstName + ' ' + lastName,
			photoURL: ''
		});
	}

	// Errors

	setError(message: string, persist: boolean): void {
		this.error = message;
		this.error_persist = persist;
	}

	resetError(): void {
		if (this.error_persist) {
			this.error_persist = false;
		} else {
			this.error = null;
		}
	}

	sendEmailVerification(user: firebase.User): Promise<void> {
		return user.sendEmailVerification();
		// return user.sendEmailVerification({ url: environment.host.domain + 'login'});
	}

	sendPasswordResetEmail(email: string): Promise<void> {
		return this.afAuth.sendPasswordResetEmail(email);
	}

	confirmPasswordReset(code: string, password: string): Promise<void> {
		return this.afAuth.confirmPasswordReset(code, password);
	}

	// Getters

	/**
	 *	Returns the logged in firebase user
	 */
	getUser(): Observable<firebase.User> {
		if (!this._user) {
			this._user = new Observable<firebase.User>((observer: Observer<firebase.User>) => {
				this.afAuth.onIdTokenChanged((user: firebase.User) => {
					observer.next(user ? user : null);
				});
			}).pipe(
				shareReplay(1)
			);
		}
		return this._user;
	}

	isConnectionEstablished(): Observable<boolean> {
		if (!this._connectionEstablished) {
			this._connectionEstablished = this.db.object<boolean>(
				'.info/connected'
			).valueChanges().pipe(
				tap(is => console.log('connected', is)),
				shareReplay(1)
			);
		}
		return this._connectionEstablished;
	}

	isOffline(): Observable<boolean> {
		if (!this._offline) {
			this._offline = this.isConnectionEstablished().pipe(
				debounceTime(2000),
				map(is => !is),
				tap(is => console.log('offline', is)),
				shareReplay(1)
			);
		}
		return this._offline;
	}

	/**
	 *	Returns the logged in firebase user only if its email is verified
	 */
	getLoggedUser(): Observable<firebase.User> {
		if (!this._loggedUser) {
			this._loggedUser = this.getUser().pipe(
				filter((user: firebase.User) => !!user && user.emailVerified),
				shareReplay(1)
			);
		}
		return this._loggedUser;
	}

	/**
	 *	Returns a user with no safety critical information
	 *	and saves it to speed up loggin and allow it offline
	 */
	getSimpleUser(): Observable<SimpleUser> {
		if (!this._simpleUser) {
			this._simpleUser = Tools.enableCache(
				this.getUser().pipe(
					map((user: firebase.User) => user ? { emailVerified: user.emailVerified } : null)
				),
				"auth-me"
			).pipe(
				shareReplay(1)
			);
		}
		return this._simpleUser;
	}

	isLogged(): Observable<boolean> {
		if (!this._isLogged) {
			this._isLogged = this.getSimpleUser().pipe(
				map((user: SimpleUser) => !!user),
				shareReplay(1)
			);
		}
		return this._isLogged;
	}

	isLoggedAndHasEmailVerified(): Observable<boolean> {
		if (!this._isLoggedAndHasEmailVerified) {
			this._isLoggedAndHasEmailVerified = this.getSimpleUser().pipe(
				map((user: SimpleUser) => !!user && user.emailVerified),
				shareReplay(1)
			);
		}
		return this._isLoggedAndHasEmailVerified;
	}

	getEmailId(): Observable<string> {
		return this.getLoggedUser().pipe(
			mergeMap(
				(user: firebase.User) => user ? of(
					Tools.getEmailIdFromEmail(user.email)
				) : EMPTY
			)
		);
	}

	getUserAccountPath(): Observable<string> {
		return this.getLoggedUser().pipe(
			mergeMap(
				(user: firebase.User) => user ? of(
					this.getUserAccountPathFromUser(user)
				) : EMPTY
			)
		);
	}

	getProfile(): Observable<Profile> {
		if (!this._profile) {
			this._profile = this.getUserAccountPath().pipe(
				mergeMap(
					(accountPath: string) => Tools.enableCache(
						this.db.object<Profile>(accountPath + '/account/').valueChanges(),
						"auth-profile"
					)
				),
				shareReplay(1)
			);
		}
		return this._profile;
	}

	isAdmin(): Observable<boolean> {
		if (!this._isAdmin) {
			this._isAdmin = combineLatest(
				this.getAdminsRes(),
				this.getLoggedUser()
			).pipe(
				map(([admins, user]: [string, firebase.User]): boolean => Object.values(admins).includes(user.email)),
				catchError(() => of(false)),
				shareReplay(1)
			);
		}
		return this._isAdmin;
	}

	isAdminOf(of: string): Observable<boolean> {
		if (!ADMINS.includes(of)) {
			return null;
		}
		if (!this._isAdminOf[of]) {
			this._isAdminOf[of] = this.getOtherAdminsRes().pipe(
				map(data => data ? data[`${of}-admin`] || false : false),
				shareReplay(1)
			);
		}
		return this._isAdminOf[of];
	}

	isAssessor(): Observable<boolean> {
		if (!this._isAssessor) {
			this._isAssessor = this.getAssessorRes().pipe(
				map((user: Assessor) => user != null),
				catchError(() => of(false)),
				shareReplay(1)
			);
		}
		return this._isAssessor;
	}

	isCafetResp(): Observable<boolean> {
		if (!this._isCafetResp) {
			this._isCafetResp = this.getCafetRespRes().pipe(
				map(is => is != null),
				catchError(() => of(false)),
				shareReplay(1)
			);
		}
		return this._isCafetResp;
	}

	getComRespIds(): Observable<string[]> {
		if (!this._respComIds) {
			this._respComIds = this.getComRespRes().pipe(
				map((user: ComResp) => {
					let ids = [];
					if (user) {
						for (let i of [1, 2]) {
							if (user['groupId' + i]) {
								ids.push(user['groupId' + i]);
							}
						}
					}
					return ids;
				}),
				shareReplay(1)
			);
		}
		return this._respComIds;
	}

	isRespCom(): Observable<boolean> {
		return this.getComRespIds().pipe(
			map(ids => ids.length > 0),
			catchError(() => of(false))
		);
	}

	getJournalistIds(): Observable<string[]> {
		if (!this._journalistIds) {
			this._journalistIds = this.getJournalistRes().pipe(
				map((user: Journalist) => {
					let ids = [];
					if (user) {
						for (let i of [1, 2]) {
							if (user['groupId' + i]) {
								ids.push(user['groupId' + i]);
							}
						}
					}
					return ids;
				}),
				shareReplay(1)
			);
		}
		return this._journalistIds;
	}

	isJournalist(): Observable<boolean> {
		return this.getJournalistIds().pipe(
			map(ids => ids.length > 0),
			catchError(() => of(false))
		);
	}

	getAdminsRes(): Observable<string> {
		if (!this._adminsRes) {
			this._adminsRes = this.db.object<string>(
				'admin/private/admins'
			).valueChanges().pipe(
				shareReplay(1)
			);
		}
		return this._adminsRes;
	}

	// Private res getters

	getOtherAdminsRes(): Observable<string> {
		if (!this._otherAdminsRes) {
			this._otherAdminsRes = this.getUserAccountPath().pipe(
				mergeMap(
					(accountPath: string) => this.db.object<string>(
						accountPath + '/admin'
					).valueChanges()
				)
			).pipe(
				shareReplay(1)
			);
		}
		return this._otherAdminsRes;
	}

	getAssessorRes(): Observable<Assessor> {
		if (!this._assessorRes) {
			this._assessorRes = this.getEmailId().pipe(
				mergeMap(
					(emailId: string) => this.db.object<Assessor>(
						'vote/assessors/' + emailId
					).valueChanges()
				)
			).pipe(
				shareReplay(1)
			);
		}
		return this._assessorRes;
	}

	getCafetRespRes(): Observable<CafetResp> {
		if (!this._cafetRespRes) {
			this._cafetRespRes = this.getEmailId().pipe(
				mergeMap(
					(emailId: string) => this.db.object<CafetResp>(
						'cafet/cafetResps/resps/' + emailId
					).valueChanges()
				)
			).pipe(
				shareReplay(1)
			);
		}
		return this._cafetRespRes;
	}

	getJournalistRes(): Observable<Journalist> {
		if (!this._journalistRes) {
			this._journalistRes = this.getEmailId().pipe(
				mergeMap(
					(emailId: string) => this.db.object<Journalist>(
						'actus/journalists/users/' + emailId
					).valueChanges()
				)
			).pipe(
				shareReplay(1)
			);
		}
		return this._journalistRes;
	}

	getComRespRes(): Observable<ComResp> {
		if (!this._comRespRes) {
			this._comRespRes = this.getEmailId().pipe(
				mergeMap(
					(emailId: string) => this.db.object<ComResp>(
						'events/com-resps/resps/' + emailId
					).valueChanges()
				)
			).pipe(
				shareReplay(1)
			);
		}
		return this._comRespRes;
	}

	getEmailErrorMessage(email_ctrl: AbstractControl): string {
		return email_ctrl.hasError('required') ? this.d.l.noEmailError :
			email_ctrl.hasError('email') ? this.d.l.emailFormatError :
			email_ctrl.hasError('domain') ? this.d.l.emailDomainError :
			'';
	}

	// Form

	updateProfileFromUser(user: firebase.User, p: Profile): Promise<void> {
		return this.db.object<Profile>(
			this.getUserAccountPathFromUser(user) + '/account'
		).set(p);
	}

	// Helpers

	getUserAccountPathFromUser(user: firebase.User): string {
		return 'users/' + Tools.getEmailIdFromEmail(user.email) + '/' + user.uid;
	}

	emailDomainValidator(control: FormControl): object {
		let email = control.value;
		if (email && email.indexOf('@') != -1) {
			const domain = email.split('@')[1];
			for (let testDomain of DOMAINS) {
				if (domain === testDomain) {
					return null;
				}
			}
			return {domain: {parsedDomain: domain}};
		}
		return null;
	}

	// Router +

	goToLogin() {
		this.ngZone.run(() => this.router.navigateByUrl('/login'));
	}

	goToEmailVerif() {
		this.ngZone.run(() => this.router.navigateByUrl('/email_verif'));
	}

	goToHome() {
		this.ngZone.run(() => this.router.navigateByUrl('/home'));
	}

	onAuthError(error: any): void {
		console.log(error);
		this.setError(error, false);
	}
}
