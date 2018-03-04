import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToolsService } from '../../providers/tools.service';
import { CalService, CalEvent, PERSOS, ASSOS, COURSE } from '../cal-service/cal.service';
import { DicoService } from '../../language/dico.service';

@Component({
  selector: 'app-edit-cal',
  templateUrl: './edit-cal.component.html',
  styleUrls: ['./edit-cal.component.css']
})
export class EditCalComponent implements OnInit, OnDestroy {
  eventCtrl: FormGroup;

  event: CalEvent;
  eventWatcher: any;
  eventCtrlWatcher: any;
  error: string;

  constructor(
    private tools: ToolsService,
    private cal: CalService,
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
    return this.cal.getEvent(eventId).subscribe((event) => {
      if (event) {
        this.event = event;
      } else {
        this.event = new CalEvent(this.cal.getEventId(), "", "", "", "", PERSOS);
      }
      this.eventCtrl = this.fb.group({
        title: [this.event.title || "", [Validators.required, Validators.minLength(3)]],
        // description: [this.event.description || "", []],
        // image: [this.event.image || "", []],
        start: [new Date(this.event.start) || "", [Validators.required, this.tools.dateValidator]],
        startTime: [this.tools.getTimeFromDate(this.event.start), [Validators.required, this.tools.timeValidator]],
        end: [new Date(this.event.end) || "", [Validators.required, this.tools.dateValidator]],
        endTime: [this.tools.getTimeFromDate(this.event.end), [Validators.required, this.tools.timeValidator]],
        location: [this.event.location || "", [Validators.required]]
      });
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
  // getDescription(): string {
  //   return this.eventCtrl.get('description').value;
  // }
  // getImage(): string {
  //   return this.eventCtrl.get('image').value;
  // }
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

  onSubmit() {
    if (!this.eventCtrl.invalid) {
      this.cal.setEvent(
        new CalEvent(
          this.event.id,
          this.getTitle(),
          this.getStart(),
          this.getEnd(),
          this.getLocation(),
          this.event.type
        )
      ).then(() => {
        this.error = this.d.l.changesApplied;
      });
    }
  }

  back() {
    this.location.back();
  }

}
