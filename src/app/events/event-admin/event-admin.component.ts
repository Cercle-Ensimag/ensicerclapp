
import {first, map} from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material';

import {DeviceSizeService} from '../../providers/device-size.service';
import {EventsService, Group, ComResp} from '../events-service/events.service';
import {AuthService} from '../../auth/auth-service/auth.service';
import {ListService} from '../../providers/list.service';
import {ToolsService} from '../../providers/tools.service';
import {DicoService} from '../../language/dico.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-event-admin',
  templateUrl: './event-admin.component.html',
  styleUrls: ['./event-admin.component.css']
})
export class EventAdminComponent implements OnInit {
	public formGroup: FormGroup;
  public groupCtrl = new FormControl('', [Validators.minLength(2), Validators.maxLength(30)]);

  constructor(
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private list: ListService,
    private fb: FormBuilder,

		public location: Location,
    public events: EventsService,
    public media: DeviceSizeService,
    public tools: ToolsService,
    public d: DicoService
  ) {  }

  ngOnInit () {
		this.formGroup = this.fb.group({
			email: ['', [this.auth.emailDomainValidator, Validators.email]],
			asso1: [null, [Validators.required, Validators.maxLength(30)]],
			asso2: [null, [Validators.maxLength(30)]]
		});
	}

  filteredUsers(): Observable<ComResp[]> {
    let emailId = this.tools.getEmailIdFromEmail(this.formGroup.get('email').value);
    return this.events.getComResps().pipe(
      map(users => users.filter(
        user => user.emailId.includes(emailId)
      )));
  }

  addComResp() {
		let email = this.formGroup.get('email').value;
    let emailId = this.tools.getEmailIdFromEmail(email);
    this.list.isInList(email)
      .pipe(first())
      .subscribe(inList => {
        if (!inList) {
          let name = this.tools.getNameFromEmailId(emailId);
          this.snackBar.open(this.d.format(this.d.l.notOnTheList, name), this.d.l.okLabel, {duration: 2000});
        } else {
          this.events.addComResp(
						email,
						this.formGroup.get('asso1').value,
						this.formGroup.get('asso2').value
					);
          this.formGroup.get('email').setValue('');
          this.formGroup.get('asso1').reset();
          this.formGroup.get('asso2').reset();
        }
      });
  }

	getComRespGroups(): Observable<Group[]> {
		return this.events.getComRespGroups();
	}

	filteredGroups(): Observable<Group[]> {
		return this.events.getGroups().pipe(
			map(groups => groups.filter(
				group => group.displayName.includes(this.groupCtrl.value)
			))
		);
	}

	addGroup() {
		this.events.setGroup({
			groupId: this.events.getGroupId(),
			displayName: this.groupCtrl.value
		}).then(() => this.groupCtrl.setValue(''));
	}

	removeGroup(groupId: string) {
		this.events.removeGroup(groupId);
	}

	getUserGroupIds(user: ComResp): string[] {
		return this.events.getUserGroupIds(user);
	}

	getGroupName(groupId: string): Observable<string> {
		return this.events.getGroupName(groupId);
	}

}
