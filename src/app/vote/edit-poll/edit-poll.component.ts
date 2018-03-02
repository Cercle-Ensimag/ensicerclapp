import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Poll, Choice } from '../poll/poll.component';

import { VoteService } from '../vote-service/vote.service';
import { DicoService } from '../../language/dico.service';

@Component({
  selector: 'app-edit-poll',
  templateUrl: './edit-poll.component.html',
  styleUrls: ['./edit-poll.component.css']
})
export class EditPollComponent implements OnInit, OnDestroy {
  pollCtrl: FormGroup;

  poll: Poll;
  choices: Choice[];

  pollWatcher: any;
  choicesWatcher: any;
  pollCtrlWatcher: any;

  newChoices: {
    id: string,
    ctrl: FormGroup
  }[];

  message: string;

  constructor(
    private vote: VoteService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    public d: DicoService
  ) {
    this.newChoices = [];
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.pollWatcher = this.watchPoll(id);
    this.choicesWatcher = this.watchChoices(id);
  }

  ngOnDestroy() {
    this.pollWatcher.unsubscribe();
    this.choicesWatcher.unsubscribe();
  }

  watchPoll(pollId: string) {
    return this.vote.getPoll(pollId).subscribe((poll) => {
      if (poll) {
        this.poll = poll;
      } else {
        this.poll = new Poll();
        this.poll.id = this.vote.getPollId();
      }
      this.pollCtrl = this.fb.group({
        title: [this.poll.title || "", [Validators.required, Validators.minLength(3)]],
        description: [this.poll.description || "", []]
      });
      if (this.pollCtrlWatcher) {
        this.pollCtrlWatcher.unsubscribe();
      }
      this.pollCtrlWatcher = this.pollCtrl.valueChanges.subscribe(() => {
        this.message = null;
      })
    });
  }

  getTitle(): string {
    return this.pollCtrl.get('title').value;
  }
  getDescription(): string {
    return this.pollCtrl.get('description').value;
  }

  watchChoices(pollId: string) {
    return this.vote.getChoices(pollId).subscribe((choices) => {
      this.choices = choices || [];
      this.newChoices = [];
      for (let choice of choices || []) {
        this.newChoices.push({
          id: choice.id,
          ctrl: this.fb.group({
            label: [choice.label, [Validators.required]],
            image: [choice.image, []],
            short: [choice.short, []]
          })
        });
      }
    });
  }

  addChoice() {
    this.newChoices.push({
      id: this.vote.getChoiceId(this.poll.id),
      ctrl: this.fb.group({
        label: ["", [Validators.required]],
        image: ["", []],
        short: ["", []]
      })
    });
    this.message = null;
  }

  choicesOk() {
    for (let choice of this.newChoices) {
      if (choice.ctrl.invalid) {
        return false;
      }
    }
    return true;
  }

  removeChoice(choiceId: string) {
    var index = this.newChoices.findIndex(c => c.id === choiceId);
    if (index >= 0) {
      this.newChoices.splice(index, 1);
    }
  }

  onSubmit() {
    if (!this.pollCtrl.invalid && this.choicesOk()) {
      let choices = {};
      for (let choice of this.newChoices) {
        choices[choice.id] = {
          id: choice.id,
          label: choice.ctrl.get('label').value,
          image: choice.ctrl.get('image').value,
          short: choice.ctrl.get('short').value
        };
      }
      let poll = {
        id: this.poll.id,
        title: this.getTitle(),
        description: this.getDescription(),
        started: this.poll.started || false,
        choices: choices
      };
      this.vote.setPoll(poll);
      this.message = this.d.l.changesApplied;
    }
  }

  back() {
    this.location.back();
  }

}
