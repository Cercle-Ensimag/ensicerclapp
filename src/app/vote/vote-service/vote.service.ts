import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

import {from, Observable, of, combineLatest, EMPTY} from 'rxjs';
import {map, mergeMap, catchError, first, shareReplay, tap} from 'rxjs/operators';

import {ToolsService} from '../../providers/tools.service';
import {AuthService} from '../../auth/auth-service/auth.service';
import {Assessor} from '../vote-admin/vote-admin.component';
import {VoteUser} from '../vote-users/vote-users.component';

import {User} from 'firebase/app';

export class Choice {
  id: string;
  label: string;
  short: string;
  image: string;
}

export class Poll {
  id: string;
  title: string;
  description: string;
  started: boolean;
  choices: any;
}

@Injectable()
export class VoteService {
  private _polls: Observable<Poll[]>;
  private _votes: Observable<{ [$pollId: string]: boolean }>;
  private _poll: { [$pollId: string]: Observable<Poll> } = {};
  private _users: { [$pollId: string]: Observable<VoteUser[]> } = {};
  private _choices: { [$pollId: string]: Observable<Choice[]> } = {};
  private _results: { [$pollId: string]: { [$choiceId: string]: Observable<number> } } = {};
  private _allStartedPollsUsers: Observable<{ poll: Poll; users: VoteUser[] }[]>;
  private _assessors: Observable<Assessor[]>;

  constructor(
    private db: AngularFireDatabase,
    private auth: AuthService,
    private tools: ToolsService
  ) {
  }

  getPolls(): Observable<Poll[]> {
    if (!this._polls) {
      this._polls = this.tools.enableCache(
				this.auth.getLoggedUser().pipe(
					mergeMap(
						() => this.db.list<Poll>('vote/polls').valueChanges()
					),
					catchError(() => EMPTY)
				),
				'vote-polls'
			).pipe(
				shareReplay(1)
			);
    }
    return this._polls;
  }

  getStartedPolls(): Observable<Poll[]> {
    return this.getPolls().pipe(
			map((polls: Poll[]) =>polls.filter((poll: Poll) => poll.started)),
			shareReplay(1)
		);
  }

	getPollsIDidntAnswer(): Observable<Poll[]> {
		return combineLatest(
			this.getStartedPolls(),
			this.getVotes()
		).pipe(
			map(([polls, votes]: [Poll[], { [pollId: string]: boolean }]) => {
				let toReturn = [];
				polls.forEach(poll => {
					if (!votes[poll.id]) {
						toReturn.push(poll);
					}
				});
				return toReturn;
			}),
			shareReplay(1)
		)
	}

  getPoll(pollId: string): Observable<Poll> {
    if (!this._poll[pollId]) {
      this._poll[pollId] = this.getPolls().pipe(
				map(polls => polls.find(poll => poll.id == pollId)),
				shareReplay(1)
			);
    }
    return this._poll[pollId];
  }

  getPollId() {
    return this.db.list<Poll>('vote/polls/').push(null).key;
  }

  getVotes(): Observable<{ [pollId: string]: boolean }> {
    if (!this._votes) {
      this._votes = this.tools.enableCache(
				this.auth.getEmailId().pipe(
	        mergeMap(
						(emailId: string) => this.db.object<{ [pollId: string]: boolean }>(
							'vote/users/' + emailId + '/votes'
						).valueChanges()
					),
					catchError(() => EMPTY)
				),
				"vote-myVotes"
			).pipe(
				shareReplay(1)
			);
    }
    return this._votes;
  }

  alreadyVotedTo(pollId: string): Observable<boolean> {
    return this.getVotes().pipe(
      map((votes: { [$pollId: string]: boolean }) => votes ? votes[pollId] : false)
		);
  }

  getChoices(pollId: string): Observable<Choice[]> {
    if (!this._choices[pollId]) {
      this._choices[pollId] = this.getPoll(pollId).pipe(
				map(poll => {
					let toReturn = [];
					Object.getOwnPropertyNames(poll.choices).forEach(
						choiceId => {
							toReturn.push(poll.choices[choiceId]);
						}
					)
					return toReturn;
				}),
				shareReplay(1)
			);
    }
    return this._choices[pollId];
  }

  getChoiceId(pollId: string) {
    return this.db.list<Poll>('vote/polls/' + pollId + '/choices').push(null).key;
  }

  getResults(pollId: string, choiceId: string): Observable<number> {
    if (!this._results[pollId]) {
      this._results[pollId] = {};
    }
    if (!this._results[pollId][choiceId]) {
      this._results[pollId][choiceId] = this.db.list<boolean>(
				'vote/results/' + pollId + '/ballot_box/' + choiceId
			).valueChanges().pipe(
				map((booleans: boolean[]) => booleans.reduce((sum, bool) => sum + (bool ? 1 : 0), 0)),
        shareReplay(1)
			);
    }
    return this._results[pollId][choiceId];
  }

  getAllResults(pollId: string): Observable<{ [$choiceId: string]: number }> {
    let _choices;
    return this.getChoices(pollId).pipe(
      tap((choices: Choice[]) => {
        _choices = choices;
      }),
      mergeMap((choices: Choice[]) => combineLatest(
        choices.map((choice: Choice) => this.getResults(pollId, choice.id))
      )),
      map((results: number[]) => {
        const choicesToReturn: { [$choiceId: string]: number } = {};
        _choices.forEach((choice: Choice, index: number) => {
          choicesToReturn[choice.id] = results[index];
        });
        return choicesToReturn;
      })
		);
  }

  getUsers(pollId: string): Observable<VoteUser[]> {
    if (!this._users[pollId]) {
      this._users[pollId] = this.db.list<VoteUser>(
				'vote/votes/' + pollId
			).valueChanges().pipe(
				shareReplay(1)
			);
    }
    return this._users[pollId];
  }

  getAllStartedPollsUsers(): Observable<{ poll: Poll, users: VoteUser[] }[]> {
    if (!this._allStartedPollsUsers) {
      this._allStartedPollsUsers = this.getStartedPolls().pipe(
        mergeMap((polls: Poll[]) => combineLatest(
          combineLatest(polls.map((poll: Poll) => this.getUsers(poll.id))),
          of(polls)
				)),
        map(([users, polls]: [VoteUser[][], Poll[]]) => users.map(
					(users: VoteUser[], index: number) => ({
	          poll: polls[index],
	          users: users
	        })
				)),
        shareReplay(1)
			);
    }
    return this._allStartedPollsUsers;
  }

  setPoll(poll: Poll) {
    return this.db.object<Poll>('vote/polls/' + poll.id).set(poll);
  }

  setStarted(pollId: string, started: boolean) {
    return this.db.object<boolean>('vote/polls/' + pollId + '/started').set(started);
  }

  deletePoll(pollId: string) {
    const promises: [Promise<void>, Promise<void>, Promise<void>] = [
      this.db.object<Poll>('vote/polls/' + pollId).set(null),
      this.db.object('vote/votes/' + pollId).remove(),
      this.db.object('vote/results/' + pollId).remove()
    ];
    return Promise.all(promises);
  }

  // TODO
  sendVote(pollId: string, choiceId: string) {
    return this.auth.getEmailId().pipe(
      mergeMap((emailId: string) => this.db.object(
				'vote/results/' + pollId + '/buffer/' + emailId
			).set(choiceId).then(
				() => this.markAsVoted(pollId, emailId)
			)),
			first()
		).toPromise();
  }

  // TODO
  markAsVoted(pollId: string, email: string) {
    const emailId = this.tools.getEmailIdFromEmail(email);
    const refs = {
      emailId: emailId,
      voted: true
    };
    return this.db.object(
			'vote/votes/' + pollId + '/' + emailId
		).update(refs).then(() => {
      return this.db.object('vote/users/' + emailId + '/votes/' + pollId).set(true);
    });
  }

  getAssessors() {
    if (!this._assessors) {
      this._assessors = this.db.list<Assessor>(
				'vote/assessors'
			).valueChanges().pipe(
				shareReplay(1)
			);
    }
    return this._assessors;
  }

  removeAssessor(emailId: string) {
    return this.db.object<Assessor>('vote/assessors/' + emailId).remove();
  }

  addAssessor(email: string) {
    let emailId = this.tools.getEmailIdFromEmail(email);
    return this.db.object<Assessor>('vote/assessors/' + emailId).set({emailId: emailId});
  }
}
