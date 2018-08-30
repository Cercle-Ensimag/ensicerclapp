import {EventEmitter, Injectable} from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { FormControl } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import { AppModulesService } from '../../providers/app-modules.service';
import { ToolsService } from '../../providers/tools.service';
import { DicoService } from '../../language/dico.service';

import { ComResp } from '../../events/events-service/events.service';
import { Journalist } from '../../actus/actu-admin/actu-admin.component';
import { Assessor } from '../../vote/vote-admin/vote-admin.component';
import { CafetResp } from '../../cafet/cafet-service/cafet.service';

import { environment } from '../../../environments/environment';
import {Observable} from '../../../../node_modules/rxjs';

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
  currentUser: any;
  profile: Profile;

  isAdmin: boolean = false;
  isVoteAdmin: boolean = false;
  isAssessor: boolean = false;
  isEventsAdmin: boolean = false;
  isComResp: boolean = false;
  isActusAdmin: boolean = false;
  isJournalist: boolean = false;
  isCafetAdmin: boolean = false;
  isNsigmaAdmin: boolean = false;
  isAnnoncesAdmin: boolean = false;
  isCafetResp: boolean = false;
  cafetActivated: boolean = false;
  comRespGroupId: string = null;
  journalistGroupId: string = null;

  accessSet = {
    admins: false,
    assessors: false,
    comResps: false,
    journalists: false,
    cafetResps: false,
    profile: false
  };
  accessSetListener = new EventEmitter();

  userWatcher: any;
  profileWatcher: any;
  adminWatcher: any;
  adminOtherWatcher: any;
  assessorWatcher: any;
  comRespsWatcher: any;
  journalistsWatcher: any;
  cafetRespsWatcher: any;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private location: Location,
    private modules: AppModulesService,
    private tools: ToolsService,
    public d: DicoService
  ) {
    this.currentUser = this.afAuth.auth.currentUser;
    this.profile = new Profile('', '', '', '');
    this.error_persist = false;
  }

  watchUser() {
    return this.afAuth.auth.onIdTokenChanged((user) => {
      this.stopServices();
      if (!user) {
        this.currentUser = null;
        this.router.navigateByUrl('/login');
      } else {
        this.redirectOnTokenChange(user);
        this.currentUser = user;
        this.startServices();
      }
    });
  }

  redirectOnTokenChange(user: any) {
    if (!user) {
      return;
    }
    const path = this.location.path();

    if (path === "/login") {
      this.goToHome();
      return;
    }
    if (path === "/email_verif" && this.getCurrentUser().emailVerified) {
      this.goToHome();
      return;
    }
  }

  start() {
    this.userWatcher = this.watchUser();
  }

  stop() {
    //if (this.userWatcher) this.userWatcher.unsubscribe();
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  login(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then(
      (success) => { this.goToHome() },
      (err) => { this.onLoginError(err) }
    );
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

  deleteAccount() {
    return this.getCurrentUser().delete();
  }

  updatePassword(password: string) {
    return this.getCurrentUser().updatePassword(password);
  }

  private onLoginError(error: any) {
    console.log(error);
    this.error = error;
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  goToEmailVerif() {
    this.router.navigateByUrl('/email_verif');
  }

  goToHome() {
    this.router.navigateByUrl('/home');
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

  getEmailErrorMessage(email_ctrl: FormControl) {
    return email_ctrl.hasError('required') ? this.d.l.noEmailError :
        email_ctrl.hasError('email') ? this.d.l.emailFormatError :
        email_ctrl.hasError('domain') ? this.d.l.emailDomainError :
        '';
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getAuthState() {
    return this.afAuth.authState;
  }

  setProfile(user: any, firstName: string, lastName: string) {
    user.updateProfile({
      displayName: firstName + " " + lastName,
      photoURL: ""
    })
    .catch((err) => { console.log(err) });
  }

  updateProfile(p: Profile): Promise<any> {
    return this.updateProfileFromUser(this.getCurrentUser(), p);
  }

  updateProfileFromUser(user: any, p: Profile): Promise<any> {
    return this.db.object(this.getUserAccountPathFromUser(user)+'/account').set(p);
  }

  getEmailId(): string {
    return this.tools.getEmailIdFromEmail(this.getCurrentUser().email);
  }

  getUserAccountPath(): string {
    return this.getUserAccountPathFromUser(this.getCurrentUser());
  }

  getUserAccountPathFromUser(user: any) {
    return "users/" + this.tools.getEmailIdFromEmail(user.email) + '/' + user.uid;
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

  startServices(){
    this.startWatchingUserProfile();
    this.modules.start();
  }

  stopServices(){
    this.stopWatchingUserProfile();
    this.modules.stop();
  }

  startWatchingUserProfile() {
    this.profileWatcher = this.watchProfile();
    this.adminWatcher = this.watchIsAdmin();
    this.adminOtherWatcher = this.watchIsAdminOther();
    this.assessorWatcher = this.watchIsAssessor();
    this.comRespsWatcher = this.watchIsComResp();
    this.journalistsWatcher = this.watchIsJournalist();
    this.cafetRespsWatcher = this.watchIsCafetResp();
  }

  watchProfile() {
    return this.db.object<Profile>(this.getUserAccountPath()+'/account/')
    .valueChanges().subscribe(
      profile => {
        if (profile) {
          this.profile = profile;
          this.accessSet['profile'] = true;
          this.accessSetListener.emit('profile');
        }
      },
      err => {}
    );
  }

  watchIsAdmin() {
    return this.adminWatcher = this.db.list<string>('admin/private/admins').valueChanges()
    .subscribe(
      admins => {
        this.isAdmin = admins.includes(this.currentUser.email);
      },
      err => {}
    );
  }

  watchIsAdminOther() {
    return this.adminOtherWatcher = this.db.object<string>(this.getUserAccountPath()+'/admin').valueChanges()
    .subscribe(
      data => {
        if (data) {
          this.isVoteAdmin = data["vote-admin"] || false;
          this.isCafetAdmin = data["cafet-admin"] || false;
          this.isEventsAdmin = data["events-admin"] || false;
          this.isActusAdmin = data["actus-admin"] || false;
          this.isAnnoncesAdmin = data["annonces-admin"] || false;
          this.isNsigmaAdmin = data["nsigma-admin"] || false;
          this.cafetActivated = data["cafet-activated"] || false;
        } else {
          this.isVoteAdmin = false;
          this.isCafetAdmin = false;
          this.isEventsAdmin = false;
          this.isActusAdmin = false;
          this.isAnnoncesAdmin = false;
          this.isNsigmaAdmin = false;
          this.cafetActivated = false;
        }
        this.accessSet['admins'] = true;
        this.accessSetListener.emit('admins');
      },
      err => {}
    );
  }

  waitForAccessToXToBeSet(x: string) {
    return new Observable<AuthService>(observer => {
      if (this.accessSet[x]) {
        observer.next(this);
        observer.complete();
      } else {
        this.accessSetListener.subscribe(toWho => {
          if (toWho === x){
            observer.next(this);
            observer.complete();
          }
        });
      }
    });
  }

  watchIsAssessor() {
    return this.adminOtherWatcher = this.db.object<Assessor>('vote/assessors/'+this.getEmailId()).valueChanges()
    .subscribe(
      is => {
        this.isAssessor = is != null;
        this.accessSet['assessors'] = true;
        this.accessSetListener.emit('assessors');
      },
      err => {}
    )
  }

  watchIsComResp() {
    return this.adminOtherWatcher = this.db.object<ComResp>('events/com-resps/resps/'+this.getEmailId()).valueChanges()
    .subscribe(
      resp => {
        this.isComResp = resp != null;
        if (resp != null) {
          this.isComResp = true;
          this.comRespGroupId = resp.groupId;
        } else {
          this.isComResp = false;
          this.comRespGroupId = null;
        }
        this.accessSet['comResps'] = true;
        this.accessSetListener.emit('comResps');
      },
      err => {}
    )
  }

  watchIsJournalist() {
    return this.adminOtherWatcher = this.db.object<Journalist>('actus/journalists/users/'+this.getEmailId()).valueChanges()
    .subscribe(
      user => {
        this.isJournalist = user != null;
        if (user != null) {
          this.isJournalist = true;
          this.journalistGroupId = user.groupId;
        } else {
          this.isJournalist = false;
          this.journalistGroupId = null;
        }
        this.accessSet['journalists'] = true;
        this.accessSetListener.emit('journalists');
      },
      err => {}
    )
  }

  watchIsCafetResp() {
    return this.adminOtherWatcher = this.db.object<CafetResp>('cafet/cafetResps/resps/'+this.getEmailId()).valueChanges()
    .subscribe(
      user => {
        this.isCafetResp = user != null;
        if (user != null) {
          this.isCafetResp = true;
        } else {
          this.isCafetResp = false;
        }
        this.accessSet['cafetResps'] = true;
        this.accessSetListener.emit('cafetResps');
      },
      err => {}
    )
  }

  stopWatchingUserProfile() {
    if (this.profileWatcher) {
      this.profileWatcher.unsubscribe();
      this.profileWatcher = null;
    }
    if (this.adminWatcher) {
      this.adminWatcher.unsubscribe();
      this.adminWatcher = null;
    }
    if (this.adminOtherWatcher){
      this.adminOtherWatcher.unsubscribe();
      this.adminOtherWatcher = null;
    }
    if (this.assessorWatcher) {
      this.assessorWatcher.unsubscribe();
      this.assessorWatcher = null;
    }
    if (this.comRespsWatcher) {
      this.comRespsWatcher.unsubscribe();
      this.comRespsWatcher = null;
    }
    if (this.journalistsWatcher) {
      this.journalistsWatcher.unsubscribe();
      this.journalistsWatcher = null;
    }
    if (this.cafetRespsWatcher) {
      this.cafetRespsWatcher.unsubscribe();
      this.cafetRespsWatcher = null;
    }
  }

}
