import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';

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
  id_ctrl: FormControl;
  title_ctrl: FormControl;
  description_ctrl: FormControl;
  image_ctrl: FormControl;
  start_ctrl: FormControl;
  end_ctrl: FormControl;
  location_ctrl: FormControl;

  event: Event;
  eventWatcher: any;

  constructor(
    private auth: AuthService,
    private events: EventsService,
    private route: ActivatedRoute,
    private location: Location,
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
        this.id_ctrl = new FormControl({ value: event.id, disabled: true }, []);
      } else {
        this.event = new Event();
        this.id_ctrl = new FormControl("", [Validators.required, Validators.minLength(3)]);
      }
      this.title_ctrl = new FormControl(this.event.title || "", [Validators.required, Validators.minLength(3)]);
      this.description_ctrl = new FormControl(this.event.description || "", []);
      this.image_ctrl = new FormControl(this.event.image || "", []);
      this.start_ctrl = new FormControl(this.event.start || "", [Validators.required]);
      this.end_ctrl = new FormControl(this.event.end || "", [Validators.required]);
      this.location_ctrl = new FormControl(this.event.location || "", [Validators.required]);
    });
  }

  onSubmit() {
    if (!this.title_ctrl.invalid && ! this.description_ctrl.invalid) {
      let event = {
        id: this.id_ctrl.value,
        title: this.title_ctrl.value,
        description: this.description_ctrl.value,
        image: this.image_ctrl.value,
        start: this.start_ctrl.value,
        end: this.end_ctrl.value,
        location: this.location_ctrl.value,
        groupId: this.auth.comRespGroupId
      };
      this.events.setEvent(event);
    }
  }

  back() {
    this.location.back();
  }

}
