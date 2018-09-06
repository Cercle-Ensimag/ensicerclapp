import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import {ToolsService} from '../../providers/tools.service';
import {AuthService} from '../../auth/auth-service/auth.service';
import {Choice, Poll} from '../poll/poll.component';
import {Assessor} from '../vote-admin/vote-admin.component';
import {VoteUser} from '../vote-users/vote-users.component';

@Injectable()
export class VoteService {
  private _polls: Observable<Poll[]>;
  private _votes: Observable<{[$pollId: string]: boolean }>;
  private _poll: {[$pollId: string]: Observable<Poll>} = {};
  private _users: {[$pollId: string]: Observable<VoteUser[]>} = {};
  private _choices: {[$pollId: string]: Observable<Choice[]>} = {};
  private _results: {[$pollId: string]: {[$choiceId: string]: Observable<number>}} = {};
  private _allStartedPollsUsers: Observable<{ poll: Poll; users: VoteUser[] }[]>;
  private _assessors: Observable<Assessor[]>;

  constructor(
    private db: AngularFireDatabase,
    private auth: AuthService,
    private tools: ToolsService
  ) { }

  start() { }

  stop() { }

  getPolls(): Observable<Poll[]> {
    if (!this._polls){
      this._polls = this.db
        .list<Poll>('vote/polls')
        .valueChanges()
        .shareReplay(1);
    }
    return this._polls;
  }

  getStartedPolls(): Observable<Poll[]> {
    return this.getPolls().map((polls: Poll[]) =>
      polls.filter((poll: Poll) => poll.started)
    );
  }

  getPoll(id: string): Observable<Poll> {
    if (!this._poll[id]){
      this._poll[id] = this.auth.getEmailId()
        .flatMap((emailId: string) =>
          this.db
            .object<Poll>('vote/polls/'+id)
            .valueChanges())
        .shareReplay(1);
    }
    return this._poll[id];
  }

  getPollId() {
    return this.db.list<Poll>('vote/polls/').push(null).key;
  }

  getVotes(): Observable<{ [p: string]: boolean }> {
    if (!this._votes){
      this._votes = this.auth.getEmailId()
        .flatMap((emailId: string) =>
          this.db
          .object<{[$pollId: string]: boolean}>('vote/users/'+emailId+'/votes')
          .valueChanges())
        .shareReplay(1);
    }
    return this._votes;
  }

  alreadyVotedTo(pollId: string): Observable<boolean> {
    return this.getVotes()
      .map((votes: {[$pollId: string]: boolean}) => votes ? votes[pollId] : false);
  }

  getChoices(pollId: string): Observable<Choice[]> {
    if (!this._choices[pollId]){
      this._choices[pollId] = this.db
        .list<Choice>('vote/polls/'+pollId+'/choices')
        .valueChanges()
        .shareReplay(1);
    }
    return this._choices[pollId];
  }

  getChoiceId(pollId: string) {
    return this.db.list<Poll>('vote/polls/'+pollId+'/choices').push(null).key;
  }

  getResults(pollId: string, choiceId: string): Observable<number> {
    if (!this._results[pollId]) {
      this._results[pollId] = {}
    }
    if (!this._results[pollId][choiceId]) {
      this._results[pollId][choiceId] = this.db
        .list<boolean>('vote/results/'+pollId+'/ballot_box/'+choiceId)
        .valueChanges()
        .map((booleans: boolean[]) => booleans.reduce((sum, bool) => sum + (bool ? 1 : 0), 0))
        .shareReplay(1);
    }
    return this._results[pollId][choiceId];
  }

  getAllResults(pollId: string): Observable<{[$choiceId: string]: number}> {
    let _choices;
    return this.getChoices(pollId)
      .do((choices: Choice[]) => {_choices = choices})
      .flatMap((choices: Choice[]) => Observable.combineLatest(
        choices.map((choice: Choice) => this.getResults(pollId, choice.id))
      ))
      .map((results: number[]) => {
        const choicesToReturn: {[$choiceId: string]: number} = {};
        _choices.forEach((choice: Choice, index: number) => {
          choicesToReturn[choice.id] = results[index];
        });
        return choicesToReturn;
      });
  }

  getUsers(pollId: string): Observable<VoteUser[]> {
    if (!this._users[pollId]){
      this._users[pollId] = this.db
        .list<VoteUser>('vote/votes/'+pollId)
        .valueChanges()
        .shareReplay(1);
    }
    return this._users[pollId];
  }

  getAllStartedPollsUsers(): Observable<{poll: Poll, users: VoteUser[]}[]> {
    if (!this._allStartedPollsUsers){
      this._allStartedPollsUsers = this.getStartedPolls()
        .do(chien => console.log(chien))
        .flatMap((polls: Poll[]) => Observable.combineLatest(
          Observable.combineLatest(polls.map((poll: Poll) => this.getUsers(poll.id))),
          Observable.of(polls)))
        .map(([users, polls]:[VoteUser[][], Poll[]]) => users.map((users: VoteUser[], index: number) => ({
          poll: polls[index],
          users: users
        })))
        .do(chien => console.log(chien, 2))
        .shareReplay(1);
    }
    return this._allStartedPollsUsers;
  }

  setPoll(poll: Poll) {
    return this.db.object<Poll>('vote/polls/'+poll.id).set(poll);
  }

  setStarted(pollId: string, started: boolean) {
    return this.db.object<boolean>('vote/polls/'+pollId+'/started').set(started);
  }

  deletePoll(pollId: string) {
    const promises: [Promise<void>, Promise<void>, Promise<void>] = [
      this.db.object<Poll>('vote/polls/'+pollId).set(null),
      this.db.object('vote/votes/'+pollId).remove(),
      this.db.object('vote/results/'+pollId).remove()
    ];
    return Promise.all(promises);
  }

  // TODO
  sendVote(pollId: string, choiceId: string) {
    return this.auth.getEmailId()
      .flatMap((emailId: string) => Observable.fromPromise(
        this.db.object('vote/results/'+pollId+'/buffer/'+emailId)
          .set(choiceId)
          .then(() => this.markAsVoted(pollId, emailId))
        )
      )
      .toPromise();
  }

  // TODO
  markAsVoted(pollId: string, email: string) {
    let emailId = this.tools.getEmailIdFromEmail(email);
    let refs = {
      emailId: emailId,
      voted: true
    };
    return this.db.object('vote/votes/'+pollId+'/'+emailId).update(refs)
    .then(() => {
      return this.db.object('vote/users/'+emailId+'/votes/'+pollId).set(true);
    });
  }

  getAssessors() {
    if (!this._assessors) {
      this._assessors = this.db
        .list<Assessor>('vote/assessors')
        .valueChanges()
        .shareReplay(1);
    }
    return this._assessors;
  }

  removeAssessor(emailId: string) {
    return this.db.object<Assessor>('vote/assessors/'+emailId).remove();
  }

  addAssessor(email: string) {
    let emailId = this.tools.getEmailIdFromEmail(email);
    return this.db.object<Assessor>('vote/assessors/'+emailId).set({emailId: emailId});
  }
}
