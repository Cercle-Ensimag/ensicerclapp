import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';

import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';

import {AppModulesService} from '../../providers/app-modules.service';
import {ToolsService} from '../../providers/tools.service';
import {DicoService} from '../../language/dico.service';

import {ComResp} from '../../events/events-service/events.service';
import {Journalist} from '../../actus/actu-admin/actu-admin.component';
import {Assessor} from '../../vote/vote-admin/vote-admin.component';
import {CafetResp} from '../../cafet/cafet-service/cafet.service';
import {Observable, Observer, Subject} from '../../../../node_modules/rxjs';
import {User} from 'firebase/app';

export const ENSIDOMAIN = "ensimag.fr";
export const PHELMADOMAIN = "phelma.grenoble-inp.fr";

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
  private _isAdminOf: { [of: string]: Observable<boolean>} = {};
  private _hasCafetActivated: Observable<boolean>;
  private _isAssessor: Observable<boolean>;
  private _isCafetResp: Observable<boolean>;
  private _respComId: Observable<string>;
  private _journalistId: Observable<string>;
  private _isLogged: Observable<boolean>;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private location: Location,
    private modules: AppModulesService,
    private tools: ToolsService,
    public d: DicoService
  ) {
    this.error_persist = false;
    this.afAuth.auth.onIdTokenChanged((user: User) => this.redirectOnTokenChange(user));
  }

  redirectOnTokenChange(user: any) {
    if (!user) return this.goToLogin();

    if (this.location.path() === '/login') {
      return this.goToHome();
    }

    if (this.location.path() === '/email_verif') {
      this.getUser()
      .first()
      .subscribe(user => {
        if (user.emailVerified) this.goToHome();
      });
    }
  }

  // Methods

  login(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .catch(err => this.onLoginError(err));
  }

  logout() {
    this.afAuth.auth.signOut()
      .then(() => this.goToHome());
  }

  createAccount(
    email: string, password: string,
    firstName: string, lastName: string
  ) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then((user) => {
      this.sendEmailVerification(user);
      this.setProfile(user, firstName, lastName);
      this.updateProfileFromUser(user, new Profile(firstName, lastName, '', ''));
    })
    .catch((err) => { this.onLoginError(err); })
  }

  deleteAccount(): Promise<any> {
    return this.getLoggedUser()
      .first()
      .flatMap((user: User) => Observable.fromPromise(user.delete()))
      .toPromise();
  }

  updatePassword(password: string): Promise<any> {
    return this.getLoggedUser()
      .first()
      .flatMap((user: User) => Observable.fromPromise(user.updatePassword(password)))
      .toPromise();
  }

  updateProfile(p: Profile): Promise<any> {
    return this.getLoggedUser()
      .first()
      .flatMap((user: User) => Observable.fromPromise(this.updateProfileFromUser(user, p)))
      .toPromise();
  }

  setProfile(user: any, firstName: string, lastName: string) {
    user.updateProfile({
      displayName: firstName + " " + lastName,
      photoURL: ""
    })
      .catch((err) => { console.log(err) });
  }

  // Errors

  private onLoginError(error: any) {
    console.log(error);
    this.error = error;
  }

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
      (err) => { console.log(err) }
    );
  }

  sendPasswordResetEmail(email: string) {
    this.afAuth.auth.sendPasswordResetEmail(email)
    .catch((err) => { console.log(err) });
  }

  confirmPasswordReset(code: string, password: string) {
    this.afAuth.auth.confirmPasswordReset(code, password)
    .catch((err) => { console.log(err) });
  }

  // Getters

  getAuthState(): Observable<User> {
    return this.afAuth.authState;
  }

  getUser(): Observable<User> {
    if (!this._user){
      this._user = new Observable<User>((observer: Observer<User>) => {
          this.afAuth.auth.onIdTokenChanged((user) => {
            observer.next(user ? user : null);
          });
        })
        .shareReplay(1);
    }
    return this._user;
  }

  getLoggedUser(): Observable<User> {
    if (!this._loggedUser){
      this._loggedUser = this.getUser()
        .filter(user => !!user)
        .shareReplay(1);
    }
    return this._loggedUser;
  }

  isLogged(): Observable<boolean> {
    if (!this._isLogged){
      this._isLogged = this.getUser()
        .map(user => !!user)
        .shareReplay(1);
    }
    return this._isLogged;
  }

  getEmailId(): Observable<string> {
    return this.getLoggedUser()
      .filter((user: User) => !!user )
      .map((user: User) => this.tools.getEmailIdFromEmail(user.email));
  }

  getUserAccountPath(): Observable<string> {
    return this.getLoggedUser()
      .filter((user: User) => !!user )
      .map((user: User) => this.getUserAccountPathFromUser(user));
  }

  getProfile(): Observable<Profile> {
    if (!this._profile){
      this._profile = this.getUserAccountPath()
        .flatMap((accountPath: string) =>
          this.db
            .object<Profile>(accountPath+'/account/')
            .valueChanges())
        .shareReplay(1);
    }
    return this._profile;
  }

  isAdmin(): Observable<boolean> {
    if (!this._isAdmin){
      this._isAdmin = Observable.combineLatest(
        this.getAdminsRes(),
        this.getLoggedUser())
        .map(([admins, user]: [string, User]): boolean => Object.values(admins).includes(user.email))
        .shareReplay(1);
    }
    return this._isAdmin;
  }

  isAdminOf(of: string): Observable<boolean> {
    if (!this._isAdminOf[of]){
      this._isAdminOf[of] = this.getOtherAdminsRes()
          .map(data => data ? data[`${of}-admin`] || false : false)
          .shareReplay(1);
    }
    return this._isAdminOf[of];
  }

  hasCafetActivated(): Observable<boolean> {
    if (!this._hasCafetActivated){
      this._hasCafetActivated = this.getOtherAdminsRes()
          .map(data => data ? data[`cafet-activated`] || false : false)
          .shareReplay(1);
    }
    return this._hasCafetActivated;
  }

  isAssessor(): Observable<boolean> {
    if (!this._isAssessor) {
      this._isAssessor = this.getAssessorRes()
          .map(is => is != null)
          .shareReplay(1);
    }
    return this._isAssessor;
  }

  isCafetResp(): Observable<boolean> {
    if (!this._isCafetResp) {
      this._isCafetResp = this.getCafetRespRes()
          .map(is => is != null)
          .shareReplay(1);
    }
    return this._isCafetResp;
  }

  getRespComId(): Observable<string> {
    if (!this._respComId){
      this._respComId = this.getComRespRes()
          .map(resp => resp ? resp.groupId : null)
          .shareReplay(1);
    }
    return this._respComId;
  }

  isRespCom(): Observable<boolean> {
    return this.getJournalistId()
      .map(jid => jid !== null);
  }

  getJournalistId(): Observable<string> {
    if (!this._journalistId){
      this._journalistId = this.getJournalistRes()
          .map(user => user ? user.groupId : null)
          .shareReplay(1);
    }
    return this._journalistId;
  }

  isJournalist(): Observable<boolean> {
    return this.getJournalistId()
      .map(jid => jid !== null);
  }

  // Private res getters

  getAdminsRes(): Observable<string> {
    if (!this._adminsRes){
      this._adminsRes = this.db
        .object<string>('admin/private/admins')
        .valueChanges()
        .shareReplay(1);
    }
    return this._adminsRes;
  }

  getOtherAdminsRes(): Observable<string> {
    if (!this._otherAdminsRes) {
      this._otherAdminsRes = this.getUserAccountPath()
        .flatMap((accountPath: string) =>
          this.db.object<string>(accountPath + '/admin')
            .valueChanges()
        )
        .shareReplay(1);
    }
    return this._otherAdminsRes;
  }

  getAssessorRes(): Observable<Assessor> {
    if (!this._assessorRes) {
      this._assessorRes = this.getEmailId()
        .flatMap((emailId: string) =>
          this.db.object<Assessor>('vote/assessors/'+ emailId)
            .valueChanges()
        )
        .shareReplay(1);
    }
    return this._assessorRes;
  }

  getCafetRespRes(): Observable<CafetResp> {
    if (!this._cafetRespRes) {
      this._cafetRespRes = this.getEmailId()
        .flatMap((emailId: string) =>
          this.db.object<CafetResp>('cafet/cafetResps/resps/'+ emailId)
            .valueChanges()
        )
        .shareReplay(1);
    }
    return this._cafetRespRes;
  }

  getJournalistRes(): Observable<Journalist> {
    if (!this._journalistRes) {
      this._journalistRes = this.getEmailId()
        .flatMap((emailId: string) =>
          this.db.object<Journalist>('actus/journalists/users/'+ emailId)
            .valueChanges()
        )
        .shareReplay(1);
    }
    return this._journalistRes;
  }

  getComRespRes(): Observable<ComResp> {
    if (!this._comRespRes) {
      this._comRespRes = this.getEmailId()
        .flatMap((emailId: string) =>
          this.db.object<ComResp>('events/com-resps/resps/'+ emailId)
            .valueChanges()
        )
        .shareReplay(1);
    }
    return this._comRespRes;
  }

  // Form

  getEmailErrorMessage(email_ctrl: FormControl) {
    return email_ctrl.hasError('required') ? this.d.l.noEmailError :
      email_ctrl.hasError('email') ? this.d.l.emailFormatError :
        email_ctrl.hasError('domain') ? this.d.l.emailDomainError :
          '';
  }

  // Helpers

  updateProfileFromUser(user: User, p: Profile): Promise<any> {
    return this.db.object(this.getUserAccountPathFromUser(user)+'/account').set(p);
  }

  getUserAccountPathFromUser(user: User) {
    return "users/" + this.tools.getEmailIdFromEmail(user.email) + '/' + user.uid;
  }

  emailDomainValidator(control: FormControl) {
    let email = control.value;
    if (email && email.indexOf("@") != -1) {
      let [_, domain] = email.split("@");
      if (domain !== ENSIDOMAIN && domain !== PHELMADOMAIN) {
        return { domain: { parsedDomain: domain } };
      }
    }
    return null;
  }

  // Router +

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  goToEmailVerif() {
    this.router.navigateByUrl('/email_verif');
  }

  goToHome() {
    this.router.navigateByUrl('/home');
  }
}
