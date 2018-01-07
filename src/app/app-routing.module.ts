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
import { CafetInfoComponent } from './cafet/cafet-info/cafet-info.component';
import { CafetAdminComponent } from './cafet/cafet-admin/cafet-admin.component';

import { VoteComponent } from './vote/vote-all/vote.component';
import { PollComponent } from './vote/poll/poll.component';
import { VoteAdminComponent } from './vote/vote-admin/vote-admin.component';
import { EditPollComponent } from './vote/edit-poll/edit-poll.component';
import { ResultsComponent } from './vote/results/results.component';
import { VoteUsersComponent } from './vote/vote-users/vote-users.component';

import { CalendarComponent } from './calendar/calendar.component';
import { AccountComponent } from './account/account.component';

import { CanActivateHome } from './home/home-guard/home.service';
import { CanActivateVoteAdmin } from './vote/vote-guard/vote-admin.service';
import { CanActivateAdmin } from './admin/guard/admin-guard.service';
import { CanActivateCafetUser } from './cafet/cafet-guard/cafet-user.service';
import { CanActivateCafetAdmin } from './cafet/cafet-guard/cafet-admin.service';
import { EmailVerifGuard } from './auth/email-verif/email-verif-guard/email-verif.guard';
import { AccountGuard } from './account/account-guard/account.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'password_reset', component: PasswordResetComponent },
  
  { path: 'email_verif', component: EmailVerifComponent, canActivate: [EmailVerifGuard] },
  { path: 'account', component: AccountComponent, canActivate: [AccountGuard] },

  { path: 'home', component: DashboardComponent, canActivate: [CanActivateHome] },
  { path: 'cafet', component: CafetComponent, canActivate: [CanActivateHome, CanActivateCafetUser] },
  { path: 'cafet-info', component: CafetInfoComponent, canActivate: [CanActivateHome] },
  { path: 'cafet-admin', component: CafetAdminComponent, canActivate: [CanActivateHome, CanActivateCafetAdmin]},
  { path: 'vote', component: VoteComponent, canActivate: [CanActivateHome] },
  { path: 'vote/poll/:id', component: PollComponent, canActivate: [CanActivateHome] },
  { path: 'vote-admin', component: VoteAdminComponent, canActivate: [CanActivateHome, CanActivateVoteAdmin] },
  { path: 'vote-admin/edit/:id', component: EditPollComponent, canActivate: [CanActivateHome, CanActivateVoteAdmin] },
  { path: 'vote-admin/results/:id', component: ResultsComponent, canActivate: [CanActivateHome, CanActivateVoteAdmin] },
  { path: 'vote-admin/users/:id', component: VoteUsersComponent, canActivate: [CanActivateHome, CanActivateVoteAdmin] },
  { path: 'calendar', component: CalendarComponent, canActivate: [CanActivateHome] },
  { path: 'admin', component: AdminUsersComponent, canActivate: [CanActivateHome, CanActivateAdmin] }

];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash: true, onSameUrlNavigation: 'reload'}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
