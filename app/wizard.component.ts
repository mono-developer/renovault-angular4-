import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { WizardQuestion } from './wizardquestion.class';

import { WizardService } from './wizard.service';

@Component({
  selector: 'wizard',
  templateUrl: 'app_html/wizard.component.html',
})

export class WizardComponent {

  question: WizardQuestion;

  @Output()
  onWizardDone = new EventEmitter<any>();

  constructor(private router: Router, private wizardService: WizardService)
  {
  }
  
  nextQuestion()
  {
    return this.wizardService.getNextQuestion().then((q: WizardQuestion) => {
      if (q.id !== undefined)
      {
        this.question = q;
      }
      else
      {
        this.onWizardDone.emit(null);
      }
    });
  }  


  answerQuestion(question: number, answer: number)
  {
    this.wizardService.answerQuestion(question, answer).then((q: WizardQuestion) => this.nextQuestion())
  }

  show()
  {
    this.wizardService.resetQuestions()
      .then((any:any) => this.nextQuestion());
  }

}