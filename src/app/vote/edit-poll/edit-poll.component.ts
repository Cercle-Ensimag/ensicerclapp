import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {Poll} from '../poll/poll.component';

import {VoteService} from '../vote-service/vote.service';
import {DicoService} from '../../language/dico.service';
import {MatSnackBar} from '@angular/material';

import 'rxjs/add/operator/takeUntil';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-edit-poll',
  templateUrl: './edit-poll.component.html',
  styleUrls: ['./edit-poll.component.css']
})
export class EditPollComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  private id: string;

  public formGroup: FormGroup;
  public choices: {
    id: string,
    ctrl: FormGroup
  }[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private vote: VoteService,
    private route: ActivatedRoute,
    private fb: FormBuilder,

    public location: Location,
    public d: DicoService,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.initFormGroup();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initFormGroup() {
    this.vote.getPoll(this.id)
      .takeUntil(this.unsubscribe)
      .subscribe((poll) => {
        if (!poll){
          poll = new Poll();
          this.id = this.vote.getPollId();
        }
        this.formGroup = this.fb.group({
          title: [poll.title || "", [Validators.required, Validators.minLength(3)]],
          description: [poll.description || "", []],
          started: [poll.started || "", []]
        });
      });

    this.vote.getChoices(this.id)
      .takeUntil(this.unsubscribe)
      .subscribe((choices) => {
        this.choices = choices.map(choice => ({
            id: choice.id,
            ctrl: this.fb.group({
              label: [choice.label, [Validators.required]],
              image: [choice.image, []],
              short: [choice.short, []]
            })
          })
        );
      });
  }

  addChoice() {
    this.choices.push({
      id: this.vote.getChoiceId(this.id),
      ctrl: this.fb.group({
        label: ["", [Validators.required]],
        image: ["", []],
        short: ["", []]
      })
    });
  }

  allNewChoicesPristine(): boolean {
    return this.choices.every(choice => choice.ctrl.pristine);
  }

  choicesOk() {
    return this.choices.length && !this.choices.some(choice => choice.ctrl.invalid);
  }

  removeChoice(choiceId: string) {
    const index = this.choices.findIndex(c => c.id === choiceId);
    if (index >= 0) {
      this.choices.splice(index, 1);
    }
  }

  submit() {
    const choices = {};
    for (const choice of this.choices) {
      choices[choice.id] = {
        id: choice.id,
        label: choice.ctrl.get('label').value,
        image: choice.ctrl.get('image').value,
        short: choice.ctrl.get('short').value
      };
    }
    const poll = {
      id: this.id,
      title: this.formGroup.get('title').value,
      description: this.formGroup.get('description').value,
      started: this.formGroup.get('started').value,
      choices: choices
    };

    console.log(poll);

    this.vote.setPoll(poll)
      .then(
      () => {
        this.snackBar.open("modifications enregistrées", 'ok', {duration: 2000});
        this.initFormGroup();
      }
    );
  }
}
