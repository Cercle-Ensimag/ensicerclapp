import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';
import { DicoService } from '../../language/dico.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AuthService } from '../../auth/auth-service/auth.service';
import { ToolsService } from '../../providers/tools.service';

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

@Injectable()
export class CafetService {

  user: CafetUser;
  ingrGroups: string[];

  userWatcher: any;
  ingrGroupsWatcher: any;

  pdf: SafeResourceUrl;
  pdfName: string;

  constructor(
    private db: AngularFireDatabase,
    private tools: ToolsService,
    private auth: AuthService,
    public datepipe: DatePipe,
    public d: DicoService,
    public sanitizer: DomSanitizer
  ) { }

  start() {
    this.userWatcher = this.watchUser();
    this.ingrGroupsWatcher = this.watchIngrGroups();
  }

  stop() {
    this.userWatcher.unsubscribe();
    this.ingrGroupsWatcher = this.watchIngrGroups();
  }

  watchUser() {
    return this.db.object<CafetUser>("cafet/users/"+this.auth.getEmailId())
    .valueChanges().subscribe(user => {
      this.user = user || new CafetUser();
    })
  }

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
  }

  getUser(emailId): Observable<CafetUser> {
    return this.db.object<CafetUser>("cafet/users/"+emailId).valueChanges();
  }

  getUsers(): Observable<CafetUser[]> {
    return this.db.list<CafetUser>("cafet/users").valueChanges();
  }

  setUserAccount(user: CafetUser) {
    user.activated = true;
    return this.db.object<CafetUser>("cafet/users/"+user.emailId).set(user);
  }

  archiveUser(user: CafetUser) {
    user.activated = false;
    return this.db.object<CafetUser>("cafet/archives/users/"+user.emailId).set(user)
    .then(() => {
        return this.db.object<CafetUser>("cafet/users/"+user.emailId).remove();
    });
  }

  restoreUser(user: CafetUser) {
    user.activated = true;
    return this.db.object<CafetUser>("cafet/users/"+user.emailId).set(user)
    .then(() => {
        return this.db.object<CafetUser>("cafet/archives/users/"+user.emailId).remove();
    });
  }

  newTransaction(user: CafetUser, value: number) {
    let oldCredit = user.credit;
    let newCredit = this.tools.round(oldCredit + value, 2);
    user.credit = newCredit;
    user.lastTransactionDate = (new Date()).getTime();
    return this.setUserAccount(user).then(() => {
      return this.db.list<Transaction>("cafet/history/"+user.emailId).push({
        value: value,
        oldCredit: oldCredit,
        newCredit: newCredit,
        date: user.lastTransactionDate
      });
    });
  }

  setUserProfile(emailId: string, profile: CafetProfile) {
    return this.db.object<CafetProfile>("cafet/users/"+emailId+"/profile").set(profile);
  }

  getUserName(user: CafetUser) {
    if (!user.profile) {
      return this.tools.titleCase(user.emailId.split('|').join(' '))
    } else {
      return this.tools.titleCase(user.profile.firstName + " " + user.profile.lastName);
    }
  }

  getHistory(user: CafetUser) {
    return this.db.list<Transaction>("cafet/history/"+user.emailId).valueChanges();
  }

  accountsToPdf(users: CafetUser[]) {
    var columns = [
      { title: "Prenom", dataKey: "firstname" },
      { title: "Nom", dataKey: "lastname" },
      { title: "Solde", dataKey: "credit" },
      { title: "-", dataKey: "minus"},
      { title: "-", dataKey: "minus"},
      { title: "-", dataKey: "minus"},
      { title: "-", dataKey: "minus"},
      { title: "", dataKey: "div" },
      { title: "+", dataKey: "plus"},
      { title: "+", dataKey: "plus"}
    ];

    var rows = [];
    for (let user of users) {
      rows.push({
        firstname: user.profile.firstName,
        lastname: user.profile.lastName,
        credit: user.credit.toFixed(2) + "€"
      });
    }

    var pdf = new jsPDF('p', 'pt');
    var totalPagesExp = "%";

    var date = this.datepipe.transform((new Date()).getTime(), 'fullDate', '', this.d.l.locale);

    pdf.setProperties({
      title: `comptes_cafet_${ date.replace(/ /g, '_') }`
    });

    var pageContent = function (data) {
      var str, txtWidth, x;

      // HEADER
      pdf.setFontSize(16);
      pdf.setTextColor(40);
      pdf.setFontStyle('normal');

      str = `Comptes cafet du ${ date }`;
      txtWidth = pdf.getStringUnitWidth(str)*pdf.internal.getFontSize()/pdf.internal.scaleFactor;
      x = (pdf.internal.pageSize.width - txtWidth) / 2;

      pdf.text(str, x, 50);

      // FOOTER
      pdf.setFontSize(8);

      str = "Page " + data.pageCount + " / " + totalPagesExp;
      txtWidth = pdf.getStringUnitWidth(str)*pdf.internal.getFontSize()/pdf.internal.scaleFactor;
      x = pdf.internal.pageSize.width - txtWidth - 20;

      pdf.text(str, x, pdf.internal.pageSize.height - 20);

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
    var pdf = this.accountsToPdf(users);
    pdf.autoPrint();
    this.pdf = this.sanitizer.bypassSecurityTrustResourceUrl(pdf.output('datauristring'));
    this.pdfName = this.getAccountsPdfName();
  }

  saveAccountsPdf(users: CafetUser[]) {
    var pdf = this.accountsToPdf(users);
    pdf.save(this.getAccountsPdfName());
  }

  getAccountsPdfName() {
    return `comptes_cafet_${ this.datepipe.transform((new Date()).getTime(), 'fullDate', '', this.d.l.locale).replace(/ /g, '_') }.pdf`
  }

}
