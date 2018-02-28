import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Event } from '../events-home/events-home.component';

import { AuthService } from '../../auth/auth-service/auth.service';
import { EventsService } from '../events-service/events.service';
import { DicoService } from '../../language/dico.service';

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
  error: string;

  constructor(
    private auth: AuthService,
    private events: EventsService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    public d: DicoService
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
        start: [new Date(this.event.start) || "", [Validators.required, this.dateValidator]],
        startTime: [this.getTimeFromDate(this.event.start), [Validators.required, this.timeValidator]],
        end: [new Date(this.event.end) || "", [Validators.required, this.dateValidator]],
        endTime: [this.getTimeFromDate(this.event.end), [Validators.required, this.timeValidator]],
        location: [this.event.location || "", [Validators.required]]
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
    return (new Date(this.eventCtrl.get('start').value.toString().replace('00:00:00', time + ':00'))).getTime();
  }
  getEnd(): number {
    let time = this.eventCtrl.get('endTime').value;
    return (new Date(this.eventCtrl.get('end').value.toString().replace('00:00:00', time + ':00'))).getTime();
  }
  getLocation(): string {
    return this.eventCtrl.get('location').value;
  }

  onSubmit() {
    if (!this.eventCtrl.invalid) {
      let event = {
        id: this.event.id,
        title: this.getTitle(),
        description: this.getDescription(),
        image: this.getImage(),
        start: this.getStart(),
        end: this.getEnd(),
        location: this.getLocation(),
        groupId: this.auth.comRespGroupId
      };
      this.events.setEvent(event).then(() => {
        this.error = this.d.l.changesApplied;
      });
    }
  }

  getTimeFromDate(date: any) {
    if (!date) {
      return "";
    }
    return (new Date(date)).toString().split(' ')[4].substring(0, 5);
  }

  timeValidator(control: FormControl) {
    if (!control.value.match(/^[0-9][0-9]:[0-9][0-9]$/)){
      return { incorrect: true };
    }
    return null;
  }

  dateValidator(control: FormControl) {
    if (!control.value.toString().match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ([0-2][0-9]|3[0-2]) 20[1-9][0-9]/)){
      return { incorrect: true };
    }
    return null;
  }

  back() {
    this.location.back();
  }

}
