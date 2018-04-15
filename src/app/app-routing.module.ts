import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/auth-login/login.component';
import { SignUpComponent } from './auth/auth-signup/signup.component';
import { EmailVerifComponent } from './auth/email-verif/email-verif.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { HomeComponent } from './home/home.component';

import { AdminUsersComponent } from './admin/users/users.component';

import { DashboardComponent } from './dashboard/dashboard.component';

import { CafetComponent } from './cafet/cafet-home/cafet.component';
import { CafetAdminComponent } from './cafet/cafet-admin/cafet-admin.component';
import { CafetRespComponent } from './cafet/cafet-resp/cafet-resp.component';

import { VoteComponent } from './vote/vote-all/vote.component';
import { PollComponent } from './vote/poll/poll.component';
import { VoteAdminComponent } from './vote/vote-admin/vote-admin.component';
import { EditPollComponent } from './vote/edit-poll/edit-poll.component';
import { ResultsComponent } from './vote/results/results.component';
import { VoteUsersComponent } from './vote/vote-users/vote-users.component';
import { AssessorComponent } from './vote/assessor/assessor.component';

import { EventsHomeComponent } from './events/events-home/events-home.component';
import { EventComponent } from './events/event/event.component';
import { EventAdminComponent } from './events/event-admin/event-admin.component';
import { ComRespComponent } from './events/com-resp/com-resp.component';
import { EditEventsComponent } from './events/edit-events/edit-events.component';

import { ActusHomeComponent } from './actus/actus-home/actus-home.component';
import { ActuComponent } from './actus/actu/actu.component';
import { ActuAdminComponent } from './actus/actu-admin/actu-admin.component';
import { JournalistComponent } from './actus/journalist/journalist.component';
import { EditActusComponent } from './actus/edit-actus/edit-actus.component';

import { CalendarComponent } from './calendar/cal-home/calendar.component';
import { EditCalComponent } from './calendar/edit-cal/edit-cal.component';
import { CalSettingsComponent } from './calendar/cal-settings/cal-settings.component';

import { AccountComponent } from './account/account.component';

import { InfoComponent } from './info/info.component';

import { CanActivateHome } from './home/home-guard/home.service';
import { CanActivateVoteAdmin } from './vote/vote-guard/vote-admin.service';
import { CanActivateAssessor } from './vote/vote-guard/assessor.service';
import { CanActivateEventsAdmin } from './events/events-guard/events-admin.service';
import { CanActivateComResp } from './events/events-guard/com-resp.service';
import { CanActivateEventsEdit } from './events/events-guard/events-edit.service';
import { CanActivateActusAdmin } from './actus/actus-guard/actus-admin.service';
import { CanActivateJournalist } from './actus/actus-guard/journalist.service';
import { CanActivateActusEdit } from './actus/actus-guard/actus-edit.service';
import { CanActivateAdmin } from './admin/guard/admin-guard.service';
import { CanActivateCafetAdmin } from './cafet/cafet-guard/cafet-admin.service';
import { CanActivateCafetResp } from './cafet/cafet-guard/cafet-resp.guard';
import { EmailVerifGuard } from './auth/email-verif/email-verif-guard/email-verif.guard';
import { AccountGuard } from './account/account-guard/account.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'info', component: InfoComponent },
  { path: 'password_reset', component: PasswordResetComponent },

  { path: 'email_verif', component: EmailVerifComponent, canActivate: [EmailVerifGuard] },
  { path: 'account', component: AccountComponent, canActivate: [AccountGuard] },

  { path: 'home', component: DashboardComponent, canActivate: [CanActivateHome] },
  { path: 'cafet', component: CafetComponent, canActivate: [CanActivateHome] },
  { path: 'cafet-admin', component: CafetAdminComponent, canActivate: [CanActivateHome, CanActivateCafetAdmin]},
  { path: 'cafet-resp', component: CafetRespComponent, canActivate: [CanActivateHome, CanActivateCafetResp] },

  { path: 'vote', component: VoteComponent, canActivate: [CanActivateHome] },
  { path: 'vote/poll/:id', component: PollComponent, canActivate: [CanActivateHome] },
  { path: 'vote-admin', component: VoteAdminComponent, canActivate: [CanActivateHome, CanActivateVoteAdmin] },
  { path: 'vote-admin/edit/:id', component: EditPollComponent, canActivate: [CanActivateHome, CanActivateVoteAdmin] },
  { path: 'vote-admin/results/:id', component: ResultsComponent, canActivate: [CanActivateHome, CanActivateVoteAdmin] },
  { path: 'vote-admin/users/:id', component: VoteUsersComponent, canActivate: [CanActivateHome, CanActivateVoteAdmin] },
  { path: 'assessor', component: AssessorComponent, canActivate: [CanActivateHome, CanActivateAssessor] },

  { path: 'events', component: EventsHomeComponent, canActivate: [CanActivateHome] },
  { path: 'events/event/:id', component: EventComponent, canActivate: [CanActivateHome] },
  { path: 'events-admin', component: EventAdminComponent, canActivate: [CanActivateHome, CanActivateEventsAdmin] },
  { path: 'com-resp', component: ComRespComponent, canActivate: [CanActivateHome, CanActivateComResp] },
  { path: 'events-admin/edit/:id', component: EditEventsComponent, canActivate: [CanActivateHome, CanActivateEventsEdit] },

  { path: 'actus', component: ActusHomeComponent, canActivate: [CanActivateHome] },
  { path: 'actus/actu/:id', component: ActuComponent, canActivate: [CanActivateHome] },
  { path: 'actus-admin', component: ActuAdminComponent, canActivate: [CanActivateHome, CanActivateActusAdmin] },
  { path: 'journalist', component: JournalistComponent, canActivate: [CanActivateHome, CanActivateJournalist] },
  { path: 'actus-admin/edit/:id', component: EditActusComponent, canActivate: [CanActivateHome, CanActivateActusEdit] },

  { path: 'calendar', component: CalendarComponent, canActivate: [CanActivateHome] },
  { path: 'calendar/settings', component: CalSettingsComponent, canActivate: [CanActivateHome] },
  { path: 'calendar/edit/:id', component: EditCalComponent, canActivate: [CanActivateHome] },

  { path: 'admin', component: AdminUsersComponent, canActivate: [CanActivateHome, CanActivateAdmin] }

];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash: true, onSameUrlNavigation: 'reload'}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
