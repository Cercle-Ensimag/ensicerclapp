// angular modules
import {BrowserModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HttpClientModule} from '@angular/common/http';
import {DatePipe} from '@angular/common';
import {MarkdownModule, MarkedOptions} from 'ngx-markdown';
// angularfire modules
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireStorageModule} from '@angular/fire/storage';
// components
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AdminUsersComponent} from './admin/users/users.component';
import {HomeComponent} from './home/home.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './auth/auth-login/login.component';
import {SignUpComponent} from './auth/auth-signup/signup.component';
import {EmailVerifComponent} from './auth/email-verif/email-verif.component';
import {PasswordResetComponent} from './auth/password-reset/password-reset.component';
// app modules
import {CafetComponent} from './cafet/cafet-home/cafet.component';
import {CafetInfoComponent} from './cafet/cafet-info/cafet-info.component';
import {CafetAdminComponent} from './cafet/cafet-admin/cafet-admin.component';
import {CafetAdminUsersComponent} from './cafet/cafet-admin/cafet-admin-users/cafet-admin-users.component';
import {CafetAdminAccountsComponent} from './cafet/cafet-admin/cafet-admin-accounts/cafet-admin-accounts.component';
import {CafetAdminArchivesComponent} from './cafet/cafet-admin/cafet-admin-archives/cafet-admin-archives.component';
import {CafetAdminRespsComponent} from './cafet/cafet-admin/cafet-admin-resps/cafet-admin-resps.component';
import {TrezoComponent} from './cafet/cafet-admin/trezo/trezo.component';
import {CafetHistoryComponent} from './cafet/cafet-history/cafet-history.component';
import {EditCafetUserComponent} from './cafet/cafet-admin/edit-cafet-user/edit-cafet-user.component';
import {CafetRespComponent} from './cafet/cafet-resp/cafet-resp.component';

import {VoteComponent} from './vote/vote-all/vote.component';
import {PollComponent} from './vote/poll/poll.component';
import {VoteAdminComponent} from './vote/vote-admin/vote-admin.component';
import {EditPollComponent} from './vote/edit-poll/edit-poll.component';
import {ResultsComponent} from './vote/results/results.component';
import {VoteUsersComponent} from './vote/vote-users/vote-users.component';
import {AssessorComponent} from './vote/assessor/assessor.component';
import {VoteCardComponent} from './vote/components/vote-card/vote-card.component';

import {EventsHomeComponent} from './events/events-home/events-home.component';
import {EventComponent} from './events/event/event.component';
import {EventAdminComponent} from './events/event-admin/event-admin.component';
import {ComRespComponent} from './events/com-resp/com-resp.component';
import {EditEventsComponent} from './events/edit-events/edit-events.component';
import {EventCardComponent} from './events/components/event-card/event-card.component';

import {ActusHomeComponent} from './actus/actus-home/actus-home.component';
import {ActuComponent} from './actus/actu/actu.component';
import {ActuAdminComponent} from './actus/actu-admin/actu-admin.component';
import {JournalistComponent} from './actus/journalist/journalist.component';
import {EditActusComponent} from './actus/edit-actus/edit-actus.component';
import {ActuCardComponent} from './actus/components/actu-card/actu-card.component';

import {CalendarComponent} from './calendar/cal-home/calendar.component';
import {EditCalComponent} from './calendar/edit-cal/edit-cal.component';
import {CalSettingsComponent} from './calendar/cal-settings/cal-settings.component';
import {CalEditAllComponent} from './calendar/cal-edit-all/cal-edit-all.component';
import {DateService} from './calendar/cal-home/views/date.service';
import {View1} from './calendar/cal-home/views/view1/view1';
import {View2} from './calendar/cal-home/views/view2/view2';

import {JobAdsHomeComponent} from './jobads/jobads-home/jobads-home.component';
import {JobAdsAdminComponent} from './jobads/jobads-admin/jobads-admin.component';
import {JobAdsJobAdComponent} from './jobads/jobads-jobad/jobads-jobad.component';
import {JobAdsEditComponent} from './jobads/jobads-edit/jobads-edit.component';
import {JobAdCardComponent} from './jobads/components/jobad-card/jobad-card.component';

import {NsigmaHomeComponent} from './nsigma/nsigma-home/nsigma-home.component';
import {NsigmaJobAdComponent} from './nsigma/nsigma-jobad/nsigma-jobad.component';
import {NsigmaAdminComponent} from './nsigma/nsigma-admin/nsigma-admin.component';
import {NsigmaEditComponent} from './nsigma/nsigma-edit/nsigma-edit.component';
import {NsigmaJobAdCardComponent} from './nsigma/components/nsigma-jobad-card/nsigma-jobad-card.component';

import {AccountComponent} from './account/account.component';

import {DeleteDialogComponent} from './shared-components/delete-dialog/delete-dialog.component';
import {LoginDialogComponent} from './shared-components/login-dialog/login-dialog.component';
import {PagedGridComponent} from './shared-components/paged-grid/paged-grid.component';
import {PagedListComponent} from './shared-components/paged-list/paged-list.component';
import {LoadingComponent} from './shared-components/loading/loading.component';
import {ConditionalRouterLinkComponent} from './shared-components/conditional-router-link/conditional-router-link.component';
import {UpdatePasswordDialogComponent} from './account/components/update-password-dialog/update-password-dialog.component';

import {InfoComponent} from './info/info.component';
import {LegalNoticeComponent} from './info/legal-notice/legal-notice.component';
import {ReadmeComponent} from './info/readme/readme.component';
// services
import {AuthService} from './auth/auth-service/auth.service';
import {VoteService} from './vote/vote-service/vote.service';
import {AdminService} from './admin/admin-service/admin.service';
import {CafetService} from './cafet/cafet-service/cafet.service';
import {EventsService} from './events/events-service/events.service';
import {ActusService} from './actus/actus-service/actus.service';
import {NsigmaService} from './nsigma/nsigma.service';
import {JobAdsService} from './jobads/jobads.service';
import {CalService} from './calendar/cal-service/cal.service';

import {AppModulesService} from './providers/app-modules.service';
import {DeviceSizeService} from './providers/device-size.service';
import {ListService} from './providers/list.service';

import {CanActivateHome} from './home/home-guard/home.guard';
import {CanActivateVoteAdmin} from './vote/vote-guard/vote-admin.guard';
import {CanActivateAssessor} from './vote/vote-guard/assessor.guard';
import {CanActivateEventsAdmin} from './events/events-guard/events-admin.guard';
import {CanActivateComResp} from './events/events-guard/com-resp.guard';
import {CanActivateEventsEdit} from './events/events-guard/events-edit.guard';
import {CanActivateActusAdmin} from './actus/actus-guard/actus-admin.guard';
import {CanActivateJournalist} from './actus/actus-guard/journalist.guard';
import {CanActivateActusEdit} from './actus/actus-guard/actus-edit.guard';
import {CanActivateAdmin} from './admin/admin-guard/admin-guard';
import {CanActivateCafetAdmin} from './cafet/cafet-guard/cafet-admin.guard';
import {CanActivateCafetResp} from './cafet/cafet-guard/cafet-resp.guard';
import {EmailVerifGuard} from './auth/email-verif/email-verif-guard/email-verif.guard';
import {NsigmaGuard} from './nsigma/nsigma.guard';
import {JobAdsGuard} from './jobads/jobads.guard';

import {DicoService} from './language/dico.service';
// angular materials
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';

import {environment} from '../environments/environment';

import 'hammerjs';
import { ServiceWorkerModule } from '@angular/service-worker';
import {HammerFix} from '../HammerFix';

@NgModule({
	declarations: [
		AppComponent,
		AdminUsersComponent,
		HomeComponent, DashboardComponent,
		LoginComponent, SignUpComponent, EmailVerifComponent, PasswordResetComponent,
		CafetComponent, CafetInfoComponent, CafetAdminComponent, CafetAdminUsersComponent, CafetAdminAccountsComponent, CafetAdminArchivesComponent, CafetAdminRespsComponent, TrezoComponent, CafetHistoryComponent, EditCafetUserComponent, CafetRespComponent,
		VoteComponent, PollComponent, VoteAdminComponent, EditPollComponent, ResultsComponent, VoteUsersComponent, AssessorComponent, VoteCardComponent,
		CalendarComponent, EditCalComponent, CalSettingsComponent, CalEditAllComponent,
		View1, View2,
		EventsHomeComponent, EventComponent, EventAdminComponent, ComRespComponent, EditEventsComponent, EventCardComponent,
		ActusHomeComponent, ActuComponent, ActuAdminComponent, JournalistComponent, EditActusComponent, ActuCardComponent,
		InfoComponent, ReadmeComponent, LegalNoticeComponent,
		AccountComponent,
		JobAdsHomeComponent, JobAdsAdminComponent, JobAdsJobAdComponent, JobAdsEditComponent, JobAdCardComponent,
		NsigmaAdminComponent, NsigmaHomeComponent, NsigmaJobAdComponent, NsigmaEditComponent, NsigmaJobAdCardComponent,
		DeleteDialogComponent,
		LoginDialogComponent,
		LoadingComponent,
		ConditionalRouterLinkComponent,
		PagedGridComponent, PagedListComponent,
		UpdatePasswordDialogComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		FormsModule, ReactiveFormsModule,
		AngularFireModule.initializeApp(environment.firebase), AngularFireAuthModule, AngularFireDatabaseModule, AngularFireStorageModule,
		MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatToolbarModule, MatSidenavModule, MatListModule, MatCardModule, MatSnackBarModule, MatSlideToggleModule, MatTabsModule, MatExpansionModule, MatCheckboxModule, MatPaginatorModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatDialogModule, MatProgressSpinnerModule, MatTableModule,
		FlexLayoutModule,
		MarkdownModule.forRoot({
			markedOptions: {
				provide: MarkedOptions,
				useValue: {
					sanitize: true
				}
			}
		}),
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
	],
	providers: [
		AuthService, VoteService, AdminService, CafetService, EventsService, ActusService, NsigmaService, NsigmaGuard, JobAdsService, JobAdsGuard, CalService, DateService,
		AppModulesService, DeviceSizeService, ListService,
		CanActivateHome, CanActivateVoteAdmin, CanActivateAssessor, CanActivateEventsAdmin, CanActivateComResp, CanActivateEventsEdit, CanActivateActusAdmin, CanActivateJournalist, CanActivateCafetResp, CanActivateActusEdit, CanActivateAdmin, CanActivateCafetAdmin, EmailVerifGuard,
		DicoService, DatePipe,
		{
			// hammer instantion with custom config for scroll fix
			provide: HAMMER_GESTURE_CONFIG,
			useClass: HammerFix,
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
