import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {ToolsService} from '../../providers/tools.service';
import {CalEvent, CalService, PERSOS} from '../cal-service/cal.service';
import {DicoService} from '../../language/dico.service';
import {MatSnackBar} from '@angular/material';

import {of, Subject} from 'rxjs';
import {first, flatMap, map, takeUntil, tap} from 'rxjs/operators';


@Component({
  selector: 'app-edit-cal',
  templateUrl: './edit-cal.component.html',
  styleUrls: ['./edit-cal.component.css']
})
export class EditCalComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();


  public formGroup: FormGroup;
  public id: string;

  constructor(
    private cal: CalService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,

    public tools: ToolsService,
    public location: Location,
    public d: DicoService
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
    this.cal.getEvent(this.id)
      .pipe(
        takeUntil(this.unsubscribe),
        flatMap((event: CalEvent) => {
          if (event) return of(event);
          return this.cal.getEventId().pipe(
            first(),
            tap(id => this.id = id),
            map(id => new CalEvent(id, '', '', '', 1, '', PERSOS)));

        }))
      .subscribe((event) => {
        this.formGroup = this.fb.group({
          title: [event.title || '', [Validators.required, Validators.minLength(3)]],
          start: [new Date(event.start) || '', [Validators.required, this.tools.dateValidator]],
          startTime: [this.tools.getTimeFromDate(event.start), [Validators.required, this.tools.timeValidator]],
          end: [new Date(event.end) || '', [Validators.required, this.tools.dateValidator]],
          occurences: [event.occurences || 1, [Validators.required, Validators.min(1), Validators.max(42)]],
          endTime: [this.tools.getTimeFromDate(event.end), [Validators.required, this.tools.timeValidator]],
          location: [event.location || '', []]
        });
        this.formGroup.get('start').valueChanges
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(value => {
            this.formGroup.get('end').setValue(value);
          });
        this.formGroup.get('startTime').valueChanges
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(value => {
            this.formGroup.get('endTime').setValue(value);
          });
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
    this.cal.setEvent(
      new CalEvent(
        this.id,
        this.formGroup.get('title').value,
        this.getStart(),
        this.getEnd(),
        this.formGroup.get('occurences').value,
        this.formGroup.get('location').value,
        PERSOS
      )
    ).then(() => {
      this.snackBar.open(this.d.l.changesApplied, 'ok', {duration: 2000});
      this.initFormGroup();
    });
  }
}
