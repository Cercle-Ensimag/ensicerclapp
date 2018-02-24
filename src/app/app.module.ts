// angular modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

// angularfire modules
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

// components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AdminUsersComponent } from './admin/users/users.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './auth/auth-login/login.component';
import { SignUpComponent } from './auth/auth-signup/signup.component';
import { EmailVerifComponent } from './auth/email-verif/email-verif.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';

// app modules
import { CafetComponent } from './cafet/cafet-home/cafet.component';
import { CafetInfoComponent } from './cafet/cafet-info/cafet-info.component';
import { CafetAdminComponent } from './cafet/cafet-admin/cafet-admin.component';

import { VoteComponent } from './vote/vote-all/vote.component';
import { PollComponent } from './vote/poll/poll.component';
import { VoteSnackbarComponent } from './vote/poll/vote-snackbar/vote-snackbar.component';
import { VoteAdminComponent } from './vote/vote-admin/vote-admin.component';
import { EditPollComponent } from './vote/edit-poll/edit-poll.component';
import { ResultsComponent } from './vote/results/results.component';
import { VoteUsersComponent } from './vote/vote-users/vote-users.component';
import { AssessorComponent } from './vote/assessor/assessor.component';

import { EventsHomeComponent } from './events/events-home/events-home.component';
import { EventComponent } from './events/event/event.component';

import { CalendarComponent } from './calendar/calendar.component';
import { AccountComponent } from './account/account.component';

import { ReadmeComponent } from './info/readme/readme.component';

// services
import { AuthService } from './auth/auth-service/auth.service';
import { VoteService } from './vote/vote-service/vote.service';
import { AdminService } from './admin/admin-service/admin.service';
import { CafetService } from './cafet/cafet-service/cafet.service';
import { EventsService } from './events/events-service/events.service';

import { AppModulesService } from './providers/app-modules.service';
import { DeviceSizeService } from './providers/device-size.service';
import { ListService } from './providers/list.service';

import { CanActivateHome } from './home/home-guard/home.service';
import { CanActivateVoteAdmin } from './vote/vote-guard/vote-admin.service';
import { CanActivateAssessor } from './vote/vote-guard/assessor.service';
import { CanActivateAdmin } from './admin/guard/admin-guard.service';
import { CanActivateCafetAdmin } from './cafet/cafet-guard/cafet-admin.service';
import { EmailVerifGuard } from './auth/email-verif/email-verif-guard/email-verif.guard';
import { AccountGuard } from './account/account-guard/account.guard';

import { DicoService } from './language/dico.service';

// angular materials
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';

import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    AdminUsersComponent,
    HomeComponent, DashboardComponent,
    LoginComponent, SignUpComponent, EmailVerifComponent, PasswordResetComponent,
    CafetComponent, CafetInfoComponent, CafetAdminComponent,
    VoteComponent, PollComponent, VoteSnackbarComponent, VoteAdminComponent, EditPollComponent, ResultsComponent, VoteUsersComponent, AssessorComponent,
    CalendarComponent,
    EventsHomeComponent, EventComponent,
    ReadmeComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule, ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase), AngularFireAuthModule, AngularFireDatabaseModule,
    MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatToolbarModule, MatSidenavModule, MatListModule, MatCardModule, MatSnackBarModule, MatSlideToggleModule, MatTabsModule, MatExpansionModule, MatCheckboxModule, MatPaginatorModule,
    FlexLayoutModule
  ],
  providers: [
    AuthService, VoteService, AdminService, CafetService, EventsService,
    AppModulesService, DeviceSizeService, ListService,
    CanActivateHome, CanActivateVoteAdmin, CanActivateAssessor, CanActivateAdmin, CanActivateCafetAdmin, EmailVerifGuard, AccountGuard,
    DicoService
  ],
  entryComponents: [
    VoteSnackbarComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
