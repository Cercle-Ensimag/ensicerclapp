import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../auth/auth-service/auth.service';
import { Poll, Choice } from '../poll/poll.component';
import { VoteUser } from '../vote-users/vote-users.component';

@Injectable()
export class VoteService {
  polls: Poll[];
  votes: {[pollId: string]: boolean} = {};

  pollsWatcher: any;
  votesWatcher: any;

  constructor(
    private db: AngularFireDatabase,
    private auth: AuthService
  ) { }

  watchPolls() {
    return this.db.list<Poll>('vote/polls').valueChanges()
    .subscribe(polls => {
      this.polls = polls || [];
    });
  }

  watchVotes() {
    return this.db.object<{[pollId: string]: boolean}>('users/'+this.auth.getEmailId()+'/votes').valueChanges()
    .subscribe(votes => {
      this.votes = votes || {};
    });
  }

  start() {
    if (this.pollsWatcher || this.votesWatcher) {
      this.stop();
    }
    this.pollsWatcher = this.watchPolls();
    this.votesWatcher = this.watchVotes();
  }

  stop() {
    if (this.pollsWatcher) {
      this.pollsWatcher.unsubscribe();
      this.pollsWatcher = null;
    }
    if (this.votesWatcher) {
      this.votesWatcher.unsubscribe();
      this.votesWatcher = null;
    }
  }

  getPoll(id: string): Observable<Poll> {
    return this.db.object<Poll>('vote/polls/'+id).valueChanges();
  }

  getChoices(pollId: string): Observable<Choice[]> {
    return this.db.list<Choice>('vote/polls/'+pollId+'/choices').valueChanges();
  }

  getResults(pollId: string, choiceId: string) {
    return this.db.list<boolean>('vote/results/'+pollId+'/ballot_box/'+choiceId).valueChanges();
  }

  getUsers(pollId: string) {
    return this.db.list<VoteUser>('vote/users/'+pollId).valueChanges();
  }

  setPoll(poll: Poll) {
    this.db.object<Poll>('vote/polls/'+poll.id).set(poll);
  }

  setStarted(pollId: string, started: boolean) {
    this.db.object<boolean>('vote/polls/'+pollId+'/started').set(started);
  }

  deletePoll(pollId: string) {
    this.db.object<Poll>('vote/polls/'+pollId).set(null);
    this.db.object('vote/users/'+pollId).remove();
    this.db.object('vote/results/'+pollId).remove();
  }

  sendVote(pollId: string, choiceId: string) {
    return this.db.object('vote/results/'+pollId+'/buffer/'+this.auth.getEmailId())
    .set(choiceId).then(() => {
      return this.markAsVoted(
        pollId,
        this.auth.getEmailIdFromEmail(this.auth.getCurrentUser().email)
      );
    });
  }

  markAsVoted(pollId: string, email: string) {
    let emailId = this.auth.getEmailIdFromEmail(email);
    let refs = {
      emailId: emailId,
      voted: true
    }
    return this.db.object('vote/users/'+pollId+'/'+emailId).update(refs)
    .then(() => {
      return this.db.object('users/'+emailId+'/votes/'+pollId).set(true);
    });
  }

}
