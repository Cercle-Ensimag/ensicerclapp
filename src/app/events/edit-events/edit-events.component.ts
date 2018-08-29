import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {Event, EventsService} from '../events-service/events.service';

import {AuthService} from '../../auth/auth-service/auth.service';
import {ToolsService} from '../../providers/tools.service';
import {DicoService} from '../../language/dico.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-edit-events',
  templateUrl: './edit-events.component.html',
  styleUrls: ['./edit-events.component.css']
})
export class EditEventsComponent implements OnInit, OnDestroy {
  eventCtrl: FormGroup;

  event: Event;
  eventWatcher: any;
  eventCtrlWatcher: any;

  constructor(
    private auth: AuthService,
    private tools: ToolsService,
    private events: EventsService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    public d: DicoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.eventWatcher = this.watchEvent(id);
  }

  ngOnDestroy() {
    this.eventWatcher.unsubscribe();
  }

  watchEvent(eventId: string) {
    return this.events.getEvent(eventId).subscribe((event) => {
      if (event) {
        this.event = event;
      } else {
        this.event = new Event();
        this.event.id = this.events.getEventId();
      }
      this.eventCtrl = this.fb.group({
        title: [this.event.title || "", [Validators.required, Validators.minLength(3)]],
        description: [this.event.description || "", []],
        image: [this.event.image || "", []],
        start: [new Date(this.event.start) || "", [Validators.required, this.tools.dateValidator]],
        startTime: [this.tools.getTimeFromDate(this.event.start), [Validators.required, this.tools.timeValidator]],
        end: [new Date(this.event.end) || "", [Validators.required, this.tools.dateValidator]],
        endTime: [this.tools.getTimeFromDate(this.event.end), [Validators.required, this.tools.timeValidator]],
        location: [this.event.location || "", [Validators.required]],
        asso: [this.event.asso || "", [Validators.required]],
        price: [this.event.price || this.d.l.free, [Validators.required]]
      })
      if (this.eventCtrlWatcher) {
        this.eventCtrlWatcher.unsubscribe();
      }
      this.eventCtrlWatcher = this.eventCtrl.valueChanges.subscribe(() => {
        this.error = null;
      });
    });
  }

  getTitle(): string {
    return this.eventCtrl.get('title').value;
  }
  getDescription(): string {
    return this.eventCtrl.get('description').value;
  }
  getImage(): string {
    return this.eventCtrl.get('image').value;
  }
  getStart(): number {
    let time = this.eventCtrl.get('startTime').value;
    return this.tools.setDayTime(this.eventCtrl.get('start').value.getTime(), time + ':00');
  }
  getEnd(): number {
    let time = this.eventCtrl.get('endTime').value;
    return this.tools.setDayTime(this.eventCtrl.get('end').value.getTime(), time + ':00');
  }
  getLocation(): string {
    return this.eventCtrl.get('location').value;
  }
  getAsso(): string {
    return this.eventCtrl.get('asso').value;
  }
  getPrice(): string {
    return this.eventCtrl.get('price').value;
  }

  submit() {
    if (!this.eventCtrl.invalid) {
      let event = {
        id: this.event.id,
        title: this.getTitle(),
        description: this.getDescription(),
        image: this.getImage(),
        start: this.getStart(),
        end: this.getEnd(),
        location: this.getLocation(),
        asso: this.getAsso(),
        price: this.getPrice(),
        groupId: this.auth.comRespGroupId
      };
      this.events.setEvent(event).then(() => {
        this.snackBar.open(this.d.l.changesApplied, 'ok', {duration: 2000});
      }).catch(reason => {
        this.snackBar.open(reason, 'ok', {duration: 2000});
      });
    }
  }

  back() {
    this.location.back();
  }

}
