
import {first, map, takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

import {DOMAINS} from '../../auth/auth-service/auth.service';
import {DeviceSizeService} from '../../providers/device-size.service';
import {VoteService, Poll} from '../vote-service/vote.service';
import {ListService} from '../../providers/list.service';
import {Tools} from '../../providers/tools.service';
import {DicoService} from '../../language/dico.service';

import {VoteUser} from '../vote-users/vote-users.component';
import {Observable, Subject} from 'rxjs';



import {MatSnackBar} from '@angular/material';

@Component({
	selector: 'app-assessor',
	templateUrl: './assessor.component.html',
	styleUrls: ['./assessor.component.css']
})
export class AssessorComponent implements OnInit, OnDestroy {
	private unsubscribe: Subject<void> = new Subject();

	public formGroup: FormGroup;
	public polls: Poll[];
	public checked: {
		[pollId: string]: boolean
	} = {};

	public domains: string[];

	constructor(
		private snackBar: MatSnackBar,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private list: ListService,

		public vote: VoteService,
		public location: Location,
		public media: DeviceSizeService,
		public d: DicoService
	) {}

	ngOnInit() {
		this.createSearchForm();
		this.vote.getStartedPolls().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(polls => {
			this.polls = polls;
			this.createPollCheckboxesCtrl();
		});
	}

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	createSearchForm() {
		this.domains = DOMAINS.map(domain => "@" + domain);
		this.formGroup = this.fb.group({
			email: ['', [this.emailValidator]],
			domain: [this.domains[0], []]
		});
	}

	getEmail(): string {
		return this.formGroup.get('email').value;
	}
	getDomain(): string {
		return this.formGroup.get('domain').value;
	}

	createPollCheckboxesCtrl() {
		this.checked = {};
		for (let poll of this.polls) {
			this.checked[poll.id] = false;
		}
	}

	filteredUsers(): Observable<{userName: string, pollName: string}[]> {
		return this.vote.getAllStartedPollsUsers().pipe(
			map((voteLists: {poll: Poll, users: VoteUser[]}[]) => {
				let toReturn = [];
				voteLists.filter(
					(voteList: {poll: Poll, users: VoteUser[]}) => this.checked[voteList.poll.id]
				).forEach((voteList: {poll: Poll, users: VoteUser[]}) => {
					toReturn = toReturn.concat(
						voteList.users.filter(
							(user: VoteUser) => user.emailId.includes(
								Tools.getEmailIdFromEmail(this.getEmail())
							)
						).map((user: VoteUser) => ({
							userName: Tools.titleCase(user.emailId.split('|').join(' ')),
							pollName: voteList.poll.title}
						))
					);
				});
				return toReturn;
			})
		);
	}

	buttonDisabled(): Observable<boolean> {
		return this.filteredUsers().pipe(
			map(users => !!users.length || this.formGroup.invalid || this.noPollSelected())
		);
	}

	markAsVoted() {
		const emailId = Tools.getEmailIdFromEmail(this.getEmail());
		const email = this.getEmail() + this.getDomain();
		const name = Tools.getNameFromEmailId(emailId);
		this.list.isInList(email).pipe(
			first()
		).subscribe(inList => {
			if (!inList) {
				this.snackBar.open(this.d.format(this.d.l.unknownUserInfo, email), this.d.l.ok);
			} else {
				for (let poll of this.polls) {
					if (this.checked[poll.id]) {
						this.vote.markAsVoted(poll.id, this.getEmail());
					}
				}
				this.formGroup.get('email').setValue('');
				this.formGroup.get('domain').setValue(this.domains[0]);
				this.snackBar.open(this.d.format(this.d.l.markedAsVoted, name), this.d.l.ok, {duration: 2000});
			}
		});
	}

	noPollSelected() {
		return !this.polls.some(poll => this.checked[poll.id]);
	}

	change(id, bool) {
		this.checked[id] = bool;
	}

	emailValidator (control: FormControl) {
		if (!control.value.match(/^[a-z]+((-|--)[a-z]+)*.[a-z]+((-|--)[a-z]+)*(|[0-9])$/)) {
			return { error: true };
		}
		return null;
	}

}
