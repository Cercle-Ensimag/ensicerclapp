import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';

import { Poll, Choice } from '../poll/poll.component';

import { VoteService } from '../vote-service/vote.service';
import { DicoService } from '../../language/dico.service';

@Component({
  selector: 'app-edit-poll',
  templateUrl: './edit-poll.component.html',
  styleUrls: ['./edit-poll.component.css']
})
export class EditPollComponent implements OnInit, OnDestroy {
  id_ctrl: FormControl;
  title_ctrl: FormControl;
  description_ctrl: FormControl;

  poll: Poll;
  choices: Choice[];

  newChoices: {
    id: string,
    id_ctrl: FormControl,
    label_ctrl: FormControl,
    image_ctrl: FormControl,
    short_ctrl: FormControl,
    exists: boolean
  }[];

  pollWatcher: any;
  choicesWatcher: any;

  constructor(
    private vote: VoteService,
    private route: ActivatedRoute,
    private location: Location,
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
        this.id_ctrl = new FormControl({ value: poll.id, disabled: true }, []);
      } else {
        this.poll = new Poll();
        this.id_ctrl = new FormControl("", [Validators.required, Validators.minLength(3)]);
      }
      this.title_ctrl = new FormControl(this.poll.title || "", [Validators.required, Validators.minLength(3)]);
      this.description_ctrl = new FormControl(this.poll.description || "", []);
    });
  }

  watchChoices(pollId: string) {
    return this.vote.getChoices(pollId).subscribe((choices) => {
      this.choices = choices || [];
      this.newChoices = [];
      for (let choice of choices || []) {
        this.newChoices.push({
          id: choice.id,
          id_ctrl: new FormControl({ value: choice.id, disabled: true }, []),
          label_ctrl: new FormControl(choice.label, []),
          image_ctrl: new FormControl(choice.image, []),
          short_ctrl: new FormControl(choice.short, []),
          exists: true
        });
      }
    });
  }

  addChoice() {
    this.newChoices.push({
      id: "",
      id_ctrl: new FormControl("", [Validators.required, Validators.minLength(3)]),//, this.choiceIdValidator]),
      label_ctrl: new FormControl("", [Validators.required]),
      image_ctrl: new FormControl("", []),
      short_ctrl: new FormControl("", []),
      exists: false
    })
  }

  exists(choiceId: string): boolean {
    for (let choice of this.newChoices) {
      if (choiceId === choice.id && choiceId !== "") {
        return true;
      }
    }
    return false;
  }

  choicesOk() {
    for (let choice of this.newChoices) {
      if (choice.id_ctrl.invalid || choice.label_ctrl.invalid ||
        choice.image_ctrl.invalid || choice.short_ctrl.invalid
      ) {
        return false;
      }
    }
    return true;
  }

  choiceIdValidator(control: FormControl) {
    if (this.exists(control.value)) {
      return {
        id: control.value
      };
    }
    return null;
  }

  removeChoice(choiceId: string) {
    var index = this.newChoices.findIndex(c => c.id === choiceId);
    if (index >= 0) {
      this.newChoices.splice(index, 1);
    }
  }

  onSubmit() {
    if (!this.title_ctrl.invalid && ! this.description_ctrl.invalid &&
      this.choicesOk()
    ) {
      let choices = {};
      for (let choice of this.newChoices) {
        choices[choice.id_ctrl.value] = {
          id: choice.id_ctrl.value,
          label: choice.label_ctrl.value,
          image: choice.image_ctrl.value,
          short: choice.short_ctrl.value
        };
      }
      let poll = {
        id: this.id_ctrl.value,
        title: this.title_ctrl.value,
        description: this.description_ctrl.value,
        started: this.poll.started || false,
        choices: choices
      };
      this.vote.setPoll(poll);
    }
  }

  back() {
    this.location.back();
  }

}
