import {Observable, zip, from} from 'rxjs';
import {first, map, mergeMap, shareReplay} from 'rxjs/operators';

import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {DatePipe} from '@angular/common';
import {DicoService} from '../../language/dico.service';
import {DomSanitizer} from '@angular/platform-browser';

import {AuthService} from '../../auth/auth-service/auth.service';
import {ToolsService} from '../../providers/tools.service';


import {DayTransaction} from '../cafet-admin/cafet-admin-accounts/cafet-admin-accounts.component';

declare var jsPDF: any;

export class CafetUser {
  credit: number;
  activated: boolean;
  emailId: string;
  creationDate: number;
  lastTransactionDate: number;
  profile: CafetProfile;
}

export class CafetProfile {
  firstName: string;
  lastName: string;
  email: string;
  exte: boolean;
}

export class Transaction {
  value: number;
  oldCredit: number;
  newCredit: number;
  date: number;
}

export class Ingredient {
  name: string;
  group: string;
  alias: string;
  image: string;
  ofTheWeek: boolean;
}

export class CafetResp {
  emailId: string;
}

@Injectable()
export class CafetService {
  /* ingrGroups: string[];
  ingrGroupsWatcher: any; */

  private _me: Observable<CafetUser>;
  private _users: Observable<CafetUser[]>;
  private _user: { [$userId: string]: Observable<CafetUser> } = {};
  private _archivesUsers: Observable<CafetUser[]>;
  private _archivesUser: { [$userId: string]: Observable<CafetUser> } = {};
  private _trezAccounts: Observable<CafetUser[]>;
  private _cafetResps: Observable<CafetResp[]>;
  private _dayTransactions: Observable<DayTransaction[]>;
  private _history: { [$userId: string]: Observable<Transaction[]> } = {};

  constructor(
    private db: AngularFireDatabase,
    private tools: ToolsService,
    private auth: AuthService,
    public datepipe: DatePipe,
    public d: DicoService,
    public sanitizer: DomSanitizer
  ) { }

  getMe(){
    if (!this._me){
      this._me = this.auth.getEmailId().pipe(
        mergeMap((emailId: string) =>
          this.db.object<CafetUser>('cafet/users/'+emailId)
          .valueChanges()),
        map(user => user || new CafetUser()),
        shareReplay(1));
    }
    return this._me
  }

  getUsers(): Observable<CafetUser[]> {
    if (!this._users){
      this._users = this.db
        .list<CafetUser>('cafet/users')
        .valueChanges()
        .pipe(
					map(users => users.sort(
						(u1, u2) => this.getUserName(u1).localeCompare(this.getUserName(u2))
					)),
					shareReplay(1)
				);
    }
    return this._users;
  }

  getUser(emailId: string): Observable<CafetUser> {
    if (!this._user[emailId]){
      this._user[emailId] = this.db
        .object<CafetUser>("cafet/users/"+emailId)
        .valueChanges()
        .pipe(shareReplay(1));
    }
    return this._user[emailId];
  }

  getArchivesUsers(): Observable<CafetUser[]> {
    if (!this._archivesUsers){
      this._archivesUsers = this.db
        .list<CafetUser>('cafet/archives/users')
        .valueChanges()
        .pipe(shareReplay(1));
    }
    return this._archivesUsers;
  }

  getArchivesUser(emailId: string): Observable<CafetUser> {
    if (!this._archivesUser[emailId]){
      this._archivesUser[emailId] = this.db
        .object<CafetUser>("cafet/users/"+emailId)
        .valueChanges()
        .pipe(shareReplay(1));
    }
    return this._archivesUser[emailId];
  }

  getTrezAccounts(): Observable<CafetUser[]> {
    if (!this._trezAccounts){
      this._trezAccounts = this.db
        .list<CafetUser>('cafet/trezo/accounts')
        .valueChanges()
        .pipe(shareReplay(1));
    }
    return this._trezAccounts;
  }

  getCafetResps() {
    if (!this._cafetResps){
      this._cafetResps = this.db
        .list<CafetResp>('cafet/cafetResps/resps')
        .valueChanges()
        .pipe(shareReplay(1));
    }
    return this._cafetResps;
  }

  setUserAccount(user: CafetUser) {
    user.activated = true;
    return this.db.object<CafetUser>("cafet/users/"+user.emailId).set(user);
  }

  getUserEmailId(email: string, exte: boolean) {
    if (exte) {
      return "%exte%" + this.tools.getEmailIdFromEmail(email);
    } else {
      return this.tools.getEmailIdFromEmail(email);
    }
  }

  updateUserAccount(user: CafetUser) {
    let refs = {
      credit: user.credit,
      lastTransactionDate: user.lastTransactionDate
    };
    return this.db.object<any>("cafet/users/"+user.emailId).update(refs);
  }

  archiveUser(user: CafetUser) {
    user.activated = false;

    let updates = {};
    updates["users/"+user.emailId] = null;
    updates["archives/users/"+user.emailId] = user;

    return this.db.object<any>("cafet").update(updates);
  }

  restoreUser(user: CafetUser) {
    user.activated = true;

    let updates = {};
    updates["users/"+user.emailId] = user;
    updates["archives/users/"+user.emailId] = null;

    return this.db.object<any>("cafet").update(updates);
  }

  deleteUser(user: CafetUser) {
    let updates = {};
    updates["history/"+user.emailId] = null;
    updates["archives/users/"+user.emailId] = null;

    return this.db.object<any>("cafet").update(updates);
  }

  newTransaction(user: CafetUser, value: number) {
    let oldCredit = user.credit;
    let newCredit = this.tools.round(oldCredit + value, 2);

    let updates = {};
    let date = (new Date()).getTime();

    updates['users/'+user.emailId+'/credit'] = newCredit;
    updates['users/'+user.emailId+'/lastTransactionDate'] = date;
    updates['history/'+user.emailId+'/'+date] = {
      value: value,
      oldCredit: oldCredit,
      newCredit: newCredit,
      date: date
    };
    return this.db.object<any>('cafet').update(updates);
  }

  newTrezoTransaction(user: CafetUser, value: number) {
    let oldCredit = user.credit;
    let newCredit = this.tools.round(oldCredit + value, 2);

    let updates = {};
    let date = (new Date()).getTime();

    updates['trezo/accounts/'+user.emailId+'/credit'] = newCredit;
    updates['trezo/accounts/'+user.emailId+'/lastTransactionDate'] = date;
    updates['history/'+user.emailId+'/'+date] = {
      value: value,
      oldCredit: oldCredit,
      newCredit: newCredit,
      date: date
    };
    return this.db.object<any>('cafet').update(updates);
  }

  newDayTransaction(user: CafetUser, value: number) {
    const date = (new Date()).getTime();
    return this.auth.getEmailId().pipe(
      first())
      .toPromise()
      .then(emailId =>
          this.db
            .object<any>('cafet/cafetResps/dayTransactions/'+user.emailId+"/"+date)
            .set({
              value: value,
              date: date,
              resp: emailId}));
  }

  getDayTransactions() {
    if (!this._dayTransactions) {
      this._dayTransactions = this.db
        .object<any>('cafet/cafetResps/dayTransactions')
        .valueChanges().pipe(
        map(dt => dt ? dt : {}))
        .pipe(shareReplay(1));
    }
    return this._dayTransactions;
  }

  validateDayTransactions() {
    return zip(
      this.db.object<any>('cafet/users').valueChanges(),
      this.getDayTransactions()
    ).pipe(first(), mergeMap(
			([users, dayTr]) => {
				let updates = {};
				if (users != null && dayTr != null) {
					Object.getOwnPropertyNames(dayTr).forEach(emailId => {
						if (!users[emailId]) {
							throw this.d.format(this.d.l.cafetUserNoLonguerExists, emailId);
						}
						updates['users/'+emailId+'/credit'] = users[emailId].credit;
						Object.getOwnPropertyNames(dayTr[emailId]).forEach(transId => {
							updates['users/'+emailId+'/lastTransactionDate'] = dayTr[emailId][transId].date;
							updates['history/'+emailId+'/'+transId] = {
								value: dayTr[emailId][transId].value,
								oldCredit: updates['users/'+emailId+'/credit'],
								newCredit: updates['users/'+emailId+'/credit'] + dayTr[emailId][transId].value,
								date: dayTr[emailId][transId].date
							};
							updates['users/'+emailId+'/credit'] += dayTr[emailId][transId].value;
							updates['cafetResps/dayTransactions/'+emailId+'/'+transId] = null
						});
					});
					return from(this.db.object<any>('cafet').update(updates));
				}
			}))
			.toPromise();
  }

  deleteDayTransaction(emailId: string, transId: string) {
    return this.db.object<any>("cafet/cafetResps/dayTransactions/"+emailId+"/"+transId).remove();
  }

  setUserProfile(emailId: string, profile: CafetProfile, activated: boolean) {
    return zip(
      activated ? this.getUser(emailId) : this.getArchivesUser(emailId),
      this.getHistory(emailId)).pipe(
      first(),
      mergeMap(([user, history]) => {
        let prefix = activated ? '': "archives/";
        let updates = {};
        updates[prefix + "users/"+emailId] = null;
        updates["history/"+emailId] = null;

        user.emailId = this.getUserEmailId(profile.email, profile.exte);
        user.profile = profile;
        updates[prefix + "users/"+user.emailId] = user;
        updates["history/"+user.emailId] = history;

        return from(this.db.object<any>("cafet").update(updates));
      }))
      .toPromise();
  }

  removeCafetResp(emailId: string) {
    return this.db.object<CafetResp>('cafet/cafetResps/resps/'+emailId).remove();
  }

  addCafetResp(resp: CafetResp) {
    return this.db.object<CafetResp>('cafet/cafetResps/resps/'+resp.emailId).set(resp);
  }

  getUserName(user: CafetUser) {
    if (!user.profile) {
      return this.tools.titleCase(user.emailId.split('|').join(' ').replace(/^%[a-z]+%/, ''));
    } else {
      let exte = user.profile.exte ? " *": '';
      return this.tools.titleCase(user.profile.firstName + " " + user.profile.lastName) + exte;
    }
  }

  getHistory(emailId: string): Observable<Transaction[]> {
    if (!this._history[emailId]) {
     this._history[emailId] = this.db
       .list<Transaction>("cafet/history/"+emailId, ref => ref.orderByChild('date'))
       .valueChanges()
       .pipe(
         map(transactions => transactions.reverse()),
         shareReplay(1));
    }
    return this._history[emailId];
  }

  accountsToPdf(users: CafetUser[]) {
    const columns = [
      { title: "Prenom", dataKey: "firstname" },
      { title: "Nom", dataKey: "lastname" },
      { title: "Solde", dataKey: "credit" },
      { title: "-", dataKey: "minus1"},
      { title: "-", dataKey: "minus"},
      { title: "-", dataKey: "minus"},
      { title: "-", dataKey: "minus"},
      { title: '', dataKey: "div" },
      { title: "+", dataKey: "plus"},
      { title: "+", dataKey: "plus"}
    ];

    const rows = [];
    for (const user of users) {
      rows.push({
        firstname: user.profile.firstName,
        lastname: user.profile.lastName + (user.profile.exte ? " *": ''),
        credit: user.credit.toFixed(2),
        minus1: user.credit < 0 ? "*********" : ''
      });
    }

    const pdf = new jsPDF('p', 'pt');
    const totalPagesExp = "%";
    const date = this.getFullDate();

    pdf.setProperties({
      title: `comptes_cafet_${ date.replace(/ /g, '_') }`
    });

    const pageContent = function (data) {
      // HEADER
      pdf.setFontSize(16);
      pdf.setTextColor(40);
      pdf.setFontType('normal');

      const header = `Comptes cafet du ${ date }`;
      const header_w = pdf.getStringUnitWidth(header)*pdf.internal.getFontSize()/pdf.internal.scaleFactor;
      const header_x = (pdf.internal.pageSize.getWidth() - header_w) / 2;

      pdf.text(header, header_x, 40);

      // FOOTER
      pdf.setFontSize(8);

      const footer = "Page " + data.pageCount + " / " + totalPagesExp;
      const footer_w = pdf.getStringUnitWidth(footer)*pdf.internal.getFontSize()/pdf.internal.scaleFactor;
      const footer_x = pdf.internal.pageSize.getWidth() - footer_w - 20;

      pdf.text(footer, footer_x, pdf.internal.pageSize.getHeight() - 20);

    };

    pdf.autoTable(columns, rows, {
      headerStyles: {
        fillColor: 50,
        textColor: 250,
        lineWidth: 0.1,
        lineColor: 100
      },
      bodyStyles: {
        lineColor: 150,
        lineWidth: 0.1
      },
      alternateRowStyles: {
        fillColor: 245
      },
      columnStyles: {
        credit: { columnWidth: 60, halign: 'right', cellPadding: { right: 15 } },
        minus1: { columnWidth: 46 },
        minus: { columnWidth: 46 },
        div: { columnWidth: 1, fillColor: 50 },
        plus: { columnWidth: 46 }
      },
      margin: { top: 60 },
      addPageContent: pageContent
    });

    pdf.putTotalPages(totalPagesExp);
    return pdf;
  }

  printAccountsPdf(users: CafetUser[]) {
    const pdf = this.accountsToPdf(users);
    pdf.autoPrint();
    return {
      src: this.sanitizer.bypassSecurityTrustResourceUrl(pdf.output('datauristring')),
      name: this.getAccountsPdfName()
    };
  }

  saveAccountsPdf(users: CafetUser[]) {
    const pdf = this.accountsToPdf(users);
    pdf.save(this.getAccountsPdfName());
    return {
      src: this.sanitizer.bypassSecurityTrustResourceUrl(pdf.output('datauristring')),
      name: this.getAccountsPdfName()
    };
  }

	getFullDate() {
		return this.datepipe.transform((new Date()).getTime(), 'fullDate', '', this.d.l.locale);
	}

  getAccountsPdfName() {
    return `comptes_cafet_${ this.getFullDate().replace(/ /g, '_') }.pdf`;
  }

  // TODO: Sandwichs

  /*
  getIngredients(): Observable<Ingredient[]> {
    return this.db.list<Ingredient>("cafet/public/ingredients/individual").valueChanges();
  }

  setIngredient(ingredient: Ingredient, key: string) {
    if (key === null) {
      return this.db.list<Ingredient>("cafet/public/ingredients/individual")
        .push(ingredient);
    } else {
      return this.db.list<Ingredient>("cafet/public/ingredients/individual")
        .update(key, ingredient);
    }
  }

  watchIngrGroups() {
    return this.db.list<string>("cafet/public/ingredients/groups").valueChanges()
      .subscribe(groups => {
        this.ingrGroups = groups;
      });
  } */

}
