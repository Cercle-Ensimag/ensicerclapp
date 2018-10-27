
import {first, takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {Event, EventsService} from '../events-service/events.service';

import {AuthService} from '../../auth/auth-service/auth.service';
import {ToolsService} from '../../providers/tools.service';
import {DicoService} from '../../language/dico.service';
import {MatSnackBar} from '@angular/material';
import {Subject} from 'rxjs';



@Component({
  selector: 'app-edit-events',
  templateUrl: './edit-events.component.html',
  styleUrls: ['./edit-events.component.css']
})
export class EditEventsComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  public id: string;
  public formGroup: FormGroup;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private d: DicoService,
    private snackBar: MatSnackBar,

    public tools: ToolsService,
    public events: EventsService,
    public location: Location
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.initFormGroup();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initFormGroup() {
    this.events.getEvent(this.id).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((event) => {
        if (!event) {
          event = new Event();
          this.id = this.events.getEventId();
        }
        this.formGroup = this.fb.group({
          title: [event.title || '', [Validators.required, Validators.maxLength(50)]],
          description: [event.description || '', [Validators.maxLength(2000)]],
          image: [event.image || '', [Validators.maxLength(500)]],
          start: [new Date(event.start) || '', [Validators.required, this.tools.dateValidator]],
          startTime: [this.tools.getTimeFromDate(event.start), [Validators.required, this.tools.timeValidator]],
          end: [new Date(event.end) || '', [Validators.required, this.tools.dateValidator]],
          endTime: [this.tools.getTimeFromDate(event.end), [Validators.required, this.tools.timeValidator]],
          location: [event.location || '', [Validators.required, Validators.maxLength(300)]],
          asso: [event.asso || '', [Validators.required, Validators.maxLength(30)]],
          price: [event.price || this.d.l.free, [Validators.required, Validators.maxLength(50)]]
        });

        this.formGroup.get('start')
          .valueChanges.pipe(
          takeUntil(this.unsubscribe))
          .subscribe(value => this.formGroup.get('end').setValue(value));
      });
  }

  getStart(): number {
    let time = this.formGroup.get('startTime').value;
    return this.tools.setDayTime(this.formGroup.get('start').value.getTime(), time + ':00');
  }
  getEnd(): number {
    let time = this.formGroup.get('endTime').value;
    return this.tools.setDayTime(this.formGroup.get('end').value.getTime(), time + ':00');
  }

  submit() {
    this.auth.getRespComId()
      .pipe(first())
      .subscribe((respComId: string) => {
        const event = {
          id: this.id,
          title: this.formGroup.get('title').value,
          description: this.formGroup.get('description').value,
          image: this.formGroup.get('image').value,
          start: this.getStart(),
          end: this.getEnd(),
          location: this.formGroup.get('location').value,
          asso: this.formGroup.get('asso').value,
          price: this.formGroup.get('price').value,
          groupId: respComId
        };
        this.events.setEvent(event).then(() => {
          this.snackBar.open(this.d.l.changesApplied, this.d.l.okLabel, {duration: 2000});
          this.initFormGroup();
        }).catch(reason => {
          this.snackBar.open(reason, this.d.l.okLabel, {duration: 2000});
        });
      });
  }

  back() {
    this.location.back();
  }

}
