import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

import {Tools} from '../../providers/tools.service';
import {AuthService} from '../../auth/auth-service/auth.service';

import {combineLatest, Observable} from 'rxjs';
import {map, mergeMap, shareReplay} from 'rxjs/operators';

export class Actu {
	id: string;
	title: string;
	description: string;
	image: string;
	pdfLink: string;
	date: string;
	author: string;
	groupId1: string;
}

export class Journalist {
	emailId: string;
	groupId1: string;
	groupId2: string;
}

export class Group {
	groupId: string;
	displayName: string;
}

@Injectable()
export class ActusService {
	private _actus: Observable<Actu[]>;
	private _journalists: Observable<Journalist[]>;
	private _actu: { [$actuId: string]: Observable<Actu> } = {};
	private _groups: Observable<Group[]>;

	constructor(
		private db: AngularFireDatabase,
		private auth: AuthService
	) { }

	getActus(): Observable<Actu[]> {
		if (!this._actus){
			this._actus = Tools.enableCache(
				this.auth.getLoggedUser().pipe(
					mergeMap(() => this.db.list<Actu>('actus/actus').valueChanges().pipe(
						map(actus => actus.reverse())
					))
				),
				'actus'
			).pipe(
				shareReplay(1)
			);
		}
		return this._actus;
	}

	getActusImRespoOf(): Observable<Actu[]> {
		return combineLatest(
			this.getActus(),
			this.auth.getJournalistIds()
		).pipe(
			map(([actus, journalistIds]: [Actu[], string[]]) => {
				return actus.filter(actu => this.imRespoOf(actu, journalistIds))
			})
		).pipe(shareReplay(1));
	}

	imRespoOf(actu: Actu, journalistIds: string[]): boolean {
		for (let actuGroupId of this.getActuGroupIds(actu)) {
			if (journalistIds.includes(actuGroupId)) {
				return true;
			}
		}
		return false;
	}

	getActu(actuId: string) {
		if (!this._actu[actuId]){
			this._actu[actuId] = this.getActus().pipe(
				map(actus => actus.find(actu => actu.id == actuId)),
				shareReplay(1)
			);
		}
		return this._actu[actuId];
	}

	getActuGroupIds(actu: Actu): string[] {
		let ids = [];
		for (let i of [1]) {
			if (actu['groupId' + i]) {
				ids.push(actu['groupId' + i]);
			}
		}
		return ids;
	}

	getActuId() {
		return this.db.list<Actu>('actus/actus/').push(null).key;
	}

	setActu(actu: Actu) {
		return this.db.object<Actu>('actus/actus/'+actu.id).set(actu);
	}

	deleteActu(actuId: string) {
		return this.db.object<Actu>('actus/actus/'+actuId).set(null);
	}

	getJournalists() {
		if (!this._journalists){
			this._journalists = this.db.list<Journalist>(
				'actus/journalists/users'
			).valueChanges().pipe(
				shareReplay(1)
			);
		}
		return this._journalists;
	}

	removeJournalist(emailId: string) {
		return this.db.object<Journalist>('actus/journalists/users/'+emailId).remove();
	}

	setGroup(group: Group) {
		return this.db.object<Group>('actus/journalists/groups/' + group.groupId).set(group);
	}

	removeGroup(groupId: string) {
		return this.db.object<Group>('actus/journalists/groups/' + groupId).remove();
	}

	getGroupId(): string {
		return this.db.list<Actu>('actus/journalists/groups').push(null).key;
	}

	getGroups(): Observable<Group[]> {
		if (!this._groups) {
			this._groups = Tools.enableCache(
				this.db.list<Group>('actus/journalists/groups').valueChanges(),
				'actus-groups'
			).pipe(
				shareReplay(1)
			);
		}
		return this._groups;
	}

	getGroupName(groupId: string): Observable<string> {
		return this.getGroups().pipe(
			map(groups => groups.find(group => group.groupId === groupId).displayName)
		);
	}

	getJournalistGroups(): Observable<Group[]> {
		return combineLatest(
			this.auth.getJournalistIds(),
			this.getGroups()
		).pipe(
			map(([journalistIds, groups]: [string[], Group[]]) => {
				return groups.filter(
					group => journalistIds.includes(group.groupId) || this.auth.isAdminOf('actus')
				);
			})
		);
	}

	getUserGroupIds(user: Journalist): string[] {
		let ids = [];
		for (let i of [1, 2]) {
			if (user['groupId' + i]) {
				ids.push(user['groupId' + i]);
			}
		}
		return ids;
	}

	addJournalist(email: string, groupId1: string, groupId2: string) {
		let emailId = Tools.getEmailIdFromEmail(email);
		return this.db.object<Journalist>('actus/journalists/users/' + emailId).set({
			emailId: emailId,
			groupId1: groupId1,
			groupId2: groupId2
		});
	}
}
