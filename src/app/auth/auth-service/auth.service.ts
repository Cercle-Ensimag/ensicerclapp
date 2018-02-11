import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { FormControl } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import { AppModulesService } from '../../providers/app-modules.service';
import { DicoService } from '../../language/dico.service';

const ENSIDOMAIN = "ensimag.fr";

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
  isCafetAdmin: boolean = false;
  cafetActivated: boolean = false;

  userWatcher: any;
  profileWatcher: any;
  adminWatcher: any;
  adminOtherWatcher: any;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private location: Location,
    private modules: AppModulesService,
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

    if (!this.getCurrentUser()) {
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
    this.userWatcher.unsubscribe();
  }

  logout() {
    this.afAuth.auth.signOut();
    this.modules.appModules = null;
  }

  login(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .catch((err) => { this.onLoginError(err); })
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

  private onEmailVerification() {
    this.router.navigateByUrl('/home');
  }

  emailDomainValidator(control: FormControl) {
    let email = control.value;
    if (email && email.indexOf("@") != -1) {
      let [_, domain] = email.split("@");
      if (domain !== ENSIDOMAIN) {
        return { domain: { parsedDomain: domain } }
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

  setProfile(user: any, firstName: string, lastName: string) {
    user.updateProfile({
      displayName: firstName + " " + lastName,
      photoURL: ""
    })
    .catch((err) => { console.log(err) });
  }

  updateProfile(p: Profile) {
    this.updateProfileFromUser(this.getCurrentUser(), p);
  }

  updateProfileFromUser(user: any, p: Profile) {
    this.db.object(this.getUserAccountPathFromUser(user)+'/account').set(p);
  }

  getEmailId(): string {
    return this.getEmailIdFromEmail(this.getCurrentUser().email);
  }

  getEmailIdFromEmail(email: string) {
    return email.toLowerCase().replace('@ensimag.fr', '').replace('.', '|');
  }

  getUserAccountPath(): string {
    return this.getUserAccountPathFromUser(this.getCurrentUser());
  }

  getUserAccountPathFromUser(user: any) {
    return "users/" + this.getEmailIdFromEmail(user.email) + '/' + user.uid;
  }

  sendEmailVerification(user: any) {
    // TODO: this.getCurrentUser().sendEmailVerification({ url: '/home'})
    user.sendEmailVerification()
    .then(() => { console.log('Verification email sent to '+user.email)})
    .catch((err) => { console.log(err) });
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
  }

  watchProfile() {
    return this.db.object<Profile>(this.getUserAccountPath()+'/account/')
    .valueChanges().subscribe(profile => {
      if (profile) {
        this.profile = profile;
      }
    });
  }

  watchIsAdmin() {
    return this.adminWatcher = this.db.list<string>('admin/public/admins').valueChanges()
    .subscribe(admins => {
      for (let admin of admins) {
        if (admin === this.currentUser.email) {
          this.isAdmin = true;
          return;
        }
      }
      this.isAdmin = false;
    });
  }

  watchIsAdminOther() {
    return this.adminOtherWatcher = this.db.object<string>(this.getUserAccountPath()+'/admin').valueChanges()
    .subscribe(data => {
      if (data) {
        this.isVoteAdmin = data["vote-admin"] || false;
        this.isCafetAdmin = data["cafet-admin"] || false;
        this.cafetActivated = data["cafet-activated"] || false;
      } else {
        this.isVoteAdmin = false;
        this.isCafetAdmin = false;
        this.cafetActivated = false;
      }
    });
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
  }

}
