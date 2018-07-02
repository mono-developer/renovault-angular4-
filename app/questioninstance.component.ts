import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ControlContainer, NgForm } from '@angular/forms';

import { Question } from './question.class';
import { WizardQuestion } from './wizardquestion.class';
import { QuestionInstance } from './questioninstance.class';
import { WizardService } from './wizard.service';
import { SettingsService } from './settings.service';

@Component({
  selector: 'questioninstance',
  templateUrl: 'app_html/questioninstance.component.html',
  styleUrls: ['app_html/questioninstance.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})

export class QuestionInstanceComponent implements OnInit {

  @Input()
  reference_table: string;

  @Input()
  reference_id: number;

  @Input()
  reference_string: string;

  @Input()
  wizardQuestion: WizardQuestion;

  @Input()
  read_only: boolean;

  question: Question;
  instance: QuestionInstance;
  showTreeReference: boolean = false;

  // @Output()
  // onChange = new EventEmitter<any>();

  private checkboxModel: boolean[];
  private multitextModel: string[];

  constructor(private router: Router, private wizardService: WizardService, private settingsService: SettingsService) {
  }

  ngOnInit() {

    this.settingsService.getQuestionInstanceShowTreeReference().then(s => this.showTreeReference = (s == 'Y'));

    this.wizardService.getQuestion(this.wizardQuestion.question)
      .then(question => {
        this.question = question;

        this.wizardService.getQuestionInstance(this.reference_table, this.reference_id, this.reference_string, this.question.id)
          .then(instance => {

            if (instance != null) {
              this.instance = instance;
            }
            else {
              this.instance = new QuestionInstance();
              this.instance.reference_table = this.reference_table;
              this.instance.reference_id = this.reference_id;
              this.instance.reference_string = this.reference_string;
              this.instance.question_id = this.question.id;
            }

            if (this.question.type == "CHECKBOX") {
              if (this.instance.answer == null) {
                this.checkboxModel = [];

                for (var i = 0; i < this.question.options.length; i++) {
                  this.checkboxModel[i] = false;
                }

              }
              else {
                this.checkboxModel = JSON.parse(this.instance.answer);
              }
            }
            else if (this.question.type == "MULTITEXT") {
              if (this.instance.answer == null) {
                this.multitextModel = [];

                for (var i = 0; i < this.question.options.length; i++) {
                  this.multitextModel[i] = "";
                }
              }
              else {
                this.multitextModel = JSON.parse(this.instance.answer);
              }
            }
          });
      });

  }

  save() {
    this.wizardService.updateQuestionInstance(this.instance);
  }

  onChangeHandler() {
    if (this.question.type == "CHECKBOX") {
      this.instance.answer = JSON.stringify(this.checkboxModel);
    }
    else if (this.question.type == "MULTITEXT") {
      this.instance.answer = JSON.stringify(this.multitextModel);
    }
    // this.onChange.emit(null);
  }

}