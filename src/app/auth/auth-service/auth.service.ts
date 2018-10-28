import {Injectable, NgZone} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {AbstractControl, FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material';

import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';
import {combineLatest, from, Observable, Observer, of} from 'rxjs';
import {catchError, debounceTime, filter, first, flatMap, map, mergeMap, shareReplay, tap} from 'rxjs/operators';
import * as firebase from 'firebase';
import {User} from 'firebase/app';

import {AppModulesService} from '../../providers/app-modules.service';
import {ToolsService} from '../../providers/tools.service';
import {DicoService} from '../../language/dico.service';

import {ComResp} from '../../events/events-service/events.service';
import {Journalist} from '../../actus/actu-admin/actu-admin.component';
import {Assessor} from '../../vote/vote-admin/vote-admin.component';
import {CafetResp} from '../../cafet/cafet-service/cafet.service';

export const DOMAINS = ['ensimag.fr', 'phelma.grenoble-inp.fr'];
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

@Injectable()
export class AuthService {
  error: any;
  error_persist: boolean;

  private _adminsRes: Observable<any> = null;
  private _otherAdminsRes: Observable<any> = null;
  private _assessorRes: Observable<any> = null;
  private _cafetRespRes: Observable<any> = null;
  private _journalistRes: Observable<any> = null;
  private _comRespRes: Observable<any> = null;

  private _user: Observable<any> = null;
  private _loggedUser: Observable<any> = null;
  private _profile: Observable<any> = null;

  private _isAdmin: Observable<any> = null;
  private _isAdminOf: { [of: string]: Observable<boolean> } = {};
  private _hasCafetActivated: Observable<boolean>;
  private _isAssessor: Observable<boolean>;
  private _isCafetResp: Observable<boolean>;
	private _respComIds: Observable<string[]>;
  private _journalistId: Observable<string>;
  private _isLogged: Observable<boolean>;
  private _isLoggedAndHasEmailVerified: Observable<boolean>;
  private _connectionEstablished: Observable<boolean>;
  private _offline: Observable<boolean>;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private location: Location,
    private modules: AppModulesService,
    private tools: ToolsService,
    private d: DicoService,
    private snackBar: MatSnackBar,
    private ngZone: NgZone
  ) {
    this.error_persist = false;
    this.afAuth.auth.onIdTokenChanged((user: User) => this.redirectOnTokenChange(user));
  }

  redirectOnTokenChange(user: any) {
    // Not logged
    if (!user){
      if (!['/login', '/signup', '/password_reset', '/infos', '/email_verif'].includes(this.location.path()))
        return this.goToLogin();

      return;
    }

    // Logged
    if (!user.emailVerified) {
      this.goToEmailVerif();
    }

    if (['/login', '/signup', '/password_reset'].includes(this.location.path())) {
      return this.goToHome();
    }

    if (this.location.path() === '/email_verif') {
      this.getUser()
        .pipe(first())
        .subscribe(user => {
          if (user.emailVerified) this.goToHome();
        });
    }
  }

  // Methods

  login(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.afAuth.auth.signOut()
      .then(() => this.goToLogin());
  }

  createAccount(
    email: string, password: string,
    firstName: string, lastName: string
  ) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((uc: firebase.auth.UserCredential) => {
        this.sendEmailVerification(uc.user);
        this.setProfile(uc.user, firstName, lastName);
        this.updateProfileFromUser(uc.user, new Profile(firstName, lastName, '', ''));
      })
      .catch((err) => {
        this.onLoginError(err);
        this.snackBar.open(err, this.d.l.okLabel);
      });
  }

  deleteAccount(): Promise<any> {
    return this.getLoggedUser()
      .pipe(
        first(),
        flatMap((user: User) => from(user.delete())))
      .toPromise();
  }

  updatePassword(password: string): Promise<any> {
    return this.getLoggedUser()
      .pipe(
        first(),
        flatMap((user: User) => from(user.updatePassword(password))))
      .toPromise();
  }

  updateProfile(p: Profile): Promise<any> {
    return this.getLoggedUser()
      .pipe(
        first(),
        flatMap((user: User) => from(this.updateProfileFromUser(user, p))))
      .toPromise();
  }

  setProfile(user: any, firstName: string, lastName: string) {
    user.updateProfile({
      displayName: firstName + ' ' + lastName,
      photoURL: ''
    })
      .catch((err) => {
        console.log(err);
      });
  }

  // Errors

  setError(message: string, persist: boolean) {
    this.error = message;
    this.error_persist = persist;
  }

  resetError() {
    if (this.error_persist) {
      this.error_persist = false;
    } else {
      this.error = null;
    }
  }

  sendEmailVerification(user: any) {
    // user.sendEmailVerification({ url: environment.host.domain + '#/home'})
    user.sendEmailVerification()
      .then(
        () => {
          this.goToEmailVerif();
          console.log('Verification email sent to ' + user.email);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  sendPasswordResetEmail(email: string) {
    this.afAuth.auth.sendPasswordResetEmail(email)
      .catch((err) => {
        console.log(err);
      });
  }

  confirmPasswordReset(code: string, password: string) {
    this.afAuth.auth.confirmPasswordReset(code, password)
      .catch((err) => {
        console.log(err);
      });
  }

  getAuthState(): Observable<User> {
    return this.afAuth.authState;
  }

  // Getters

  getUser(): Observable<User> {
    if (!this._user) {
      this._user = new Observable<User>((observer: Observer<User>) => {
        this.afAuth.auth.onIdTokenChanged((user) => {
          observer.next(user ? user : null);
        });
      }).pipe(
        shareReplay(1));
    }
    return this._user;
  }

  isConnectionEstablished(): Observable<boolean> {
    if (!this._connectionEstablished) {
      this._connectionEstablished = this.db
        .object<boolean>('.info/connected')
        .valueChanges()
        .pipe(
          tap(is => console.log('connected', is)),
          shareReplay(1));
    }
    return this._connectionEstablished;
  }

  isOffline(): Observable<boolean> {
    if (!this._offline) {
      this._offline = this.isConnectionEstablished()
        .pipe(
          debounceTime(2000),
          map(is => !is),
          tap(is => console.log('offline', is)),
          shareReplay(1));
    }
    return this._offline;
  }

  getLoggedUser(): Observable<User> {
    if (!this._loggedUser) {
      this._loggedUser = this.getUser()
        .pipe(
          filter(user => !!user),
          shareReplay(1)
        );
    }
    return this._loggedUser;
  }

  isLogged(): Observable<boolean> {
    if (!this._isLogged) {
      this._isLogged = this.getUser()
        .pipe(
          map(user => !!user),
          shareReplay(1));
    }
    return this._isLogged;
  }

  isLoggedAndHasEmailVerified(): Observable<boolean> {
    if (!this._isLoggedAndHasEmailVerified) {
      this._isLoggedAndHasEmailVerified = this.getUser()
        .pipe(
          map(user => !!user && user.emailVerified),
          shareReplay(1));
    }
    return this._isLoggedAndHasEmailVerified;
  }

  getEmailId(): Observable<string> {
    return this.getLoggedUser()
      .pipe(
        map((user: User) => this.tools.getEmailIdFromEmail(user.email)));
  }

  getUserAccountPath(): Observable<string> {
    return this.getLoggedUser()
      .pipe(
        map((user: User) => this.getUserAccountPathFromUser(user)));
  }

  getProfile(): Observable<Profile> {
    if (!this._profile) {
      this._profile = this.getUserAccountPath()
        .pipe(
          mergeMap((accountPath: string) =>
            this.db
              .object<Profile>(accountPath + '/account/')
              .valueChanges()),
          shareReplay(1));
    }
    return this._profile;
  }

  isAdmin(): Observable<boolean> {
    if (!this._isAdmin) {
      this._isAdmin = combineLatest(
        this.getAdminsRes(),
        this.getLoggedUser())
        .pipe(
          map(([admins, user]: [string, User]): boolean => Object.values(admins).includes(user.email)),
          catchError(() => of(false)),
          shareReplay(1));
    }
    return this._isAdmin;
  }

  isAdminOf(of: string): Observable<boolean> {
		if (!ADMINS.includes(of)) {
			return null;
		}
    if (!this._isAdminOf[of]) {
      this._isAdminOf[of] = this.getOtherAdminsRes()
        .pipe(
          map(data => data ? data[`${of}-admin`] || false : false),
          shareReplay(1));
    }
    return this._isAdminOf[of];
  }

  hasCafetActivated(): Observable<boolean> {
    if (!this._hasCafetActivated) {
      this._hasCafetActivated = this.getOtherAdminsRes()
        .pipe(
          map(data => data ? data[`cafet-activated`] || false : false),
          shareReplay(1));
    }
    return this._hasCafetActivated;
  }

  isAssessor(): Observable<boolean> {
    if (!this._isAssessor) {
      this._isAssessor = this.getAssessorRes()
        .pipe(
          map(is => is != null),
          catchError(() => of(false)),
          shareReplay(1));
    }
    return this._isAssessor;
  }

  isCafetResp(): Observable<boolean> {
    if (!this._isCafetResp) {
      this._isCafetResp = this.getCafetRespRes()
        .pipe(
          map(is => is != null),
          catchError(() => of(false)),
          shareReplay(1));
    }
    return this._isCafetResp;
  }

  getComRespIds(): Observable<string[]> {
    if (!this._respComIds) {
      this._respComIds = this.getComRespRes()
        .pipe(map(user => {
					let ids = []
					for (let i of [1, 2]) {
						if (user['groupId' + i]) {
							ids.push(user['groupId' + i]);
						}
					}
					return ids;
				}), shareReplay(1));
    }
    return this._respComIds;
  }

  isRespCom(): Observable<boolean> {
    return this.getComRespIds()
      .pipe(
        map(ids => ids.length > 0),
        catchError(() => of(false)));
  }

  getJournalistId(): Observable<string> {
    if (!this._journalistId) {
      this._journalistId = this.getJournalistRes()
        .pipe(
          map(user => user ? user.groupId : null),
          shareReplay(1));
    }
    return this._journalistId;
  }

  isJournalist(): Observable<boolean> {
    return this.getJournalistId()
      .pipe(
        map(jid => jid !== null),
        catchError(() => of(false)));
  }

  getAdminsRes(): Observable<string> {
    if (!this._adminsRes) {
      this._adminsRes = this.db
        .object<string>('admin/private/admins')
        .valueChanges()
        .pipe(shareReplay(1));
    }
    return this._adminsRes;
  }

  // Private res getters

  getOtherAdminsRes(): Observable<string> {
    if (!this._otherAdminsRes) {
      this._otherAdminsRes = this.getUserAccountPath().pipe(
        mergeMap((accountPath: string) =>
          this.db.object<string>(accountPath + '/admin')
            .valueChanges()
        ))
        .pipe(shareReplay(1));
    }
    return this._otherAdminsRes;
  }

  getAssessorRes(): Observable<Assessor> {
    if (!this._assessorRes) {
      this._assessorRes = this.getEmailId().pipe(
        mergeMap((emailId: string) =>
          this.db.object<Assessor>('vote/assessors/' + emailId)
            .valueChanges()
        ))
        .pipe(shareReplay(1));
    }
    return this._assessorRes;
  }

  getCafetRespRes(): Observable<CafetResp> {
    if (!this._cafetRespRes) {
      this._cafetRespRes = this.getEmailId().pipe(
        mergeMap((emailId: string) =>
          this.db.object<CafetResp>('cafet/cafetResps/resps/' + emailId)
            .valueChanges()
        ))
        .pipe(shareReplay(1));
    }
    return this._cafetRespRes;
  }

  getJournalistRes(): Observable<Journalist> {
    if (!this._journalistRes) {
      this._journalistRes = this.getEmailId().pipe(
        mergeMap((emailId: string) =>
          this.db.object<Journalist>('actus/journalists/users/' + emailId)
            .valueChanges()
        ))
        .pipe(shareReplay(1));
    }
    return this._journalistRes;
  }

  getComRespRes(): Observable<ComResp> {
    if (!this._comRespRes) {
      this._comRespRes = this.getEmailId().pipe(
        mergeMap((emailId: string) =>
          this.db.object<ComResp>('events/com-resps/resps/' + emailId)
            .valueChanges()
        ))
        .pipe(shareReplay(1));
    }
    return this._comRespRes;
  }

  getEmailErrorMessage(email_ctrl: AbstractControl) {
    return email_ctrl.hasError('required') ? this.d.l.noEmailError :
      email_ctrl.hasError('email') ? this.d.l.emailFormatError :
        email_ctrl.hasError('domain') ? this.d.l.emailDomainError :
          '';
  }

  // Form

  updateProfileFromUser(user: User, p: Profile): Promise<any> {
    return this.db.object(this.getUserAccountPathFromUser(user) + '/account').set(p);
  }

  // Helpers

  getUserAccountPathFromUser(user: User) {
    return 'users/' + this.tools.getEmailIdFromEmail(user.email) + '/' + user.uid;
  }

  emailDomainValidator(control: FormControl) {
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

  goToLogin() {
    this.ngZone.run(() => this.router.navigateByUrl('/login'));
  }

  // Router +

  goToEmailVerif() {
    this.ngZone.run(() => this.router.navigateByUrl('/email_verif'));
  }

  goToHome() {
    this.ngZone.run(() => this.router.navigateByUrl('/home'));
  }

  onLoginError(error: any) {
    console.log(error);
    this.setError(error, false);
  }
}
