import { Component, Output, Input, EventEmitter, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { WizardQuestion } from './wizardquestion.class';

import { WizardService } from './wizard.service';
import { SettingsService } from './settings.service';
import { ReportService } from './report.service';
import { AutoSaveService } from './autosave.service';
import { QuestionInstancesComponent } from './questioninstances.component';
import { SaveableComponent } from './saveablecomponent.class';

@Component({
	selector: 'wizard2',
	templateUrl: 'app_html/wizard2.component.html',
	styleUrls: ['app_html/wizard2.component.css']
})

export class Wizard2Component implements OnInit, SaveableComponent {

	display: string;
	multipageShowParent: boolean = true;
	multipageAnswerId: number = -1;
	multipageAnswerText: string = '';
	showTags: string = 'N';

	wizardQuestion: WizardQuestion;
	wizardQuestions: WizardQuestion[];

	@Input()
	treename: string = '';

	@Input()
	question_id: number = -1;

	@Input()
	answer_id: number = -1;

	@Input()
	reference_table: string;

	@Input()
	reference_id: number;

	@Input()
	reference_string: string;

	@Input()
	tagfilterparameter: string;

	@Input()
	read_only: boolean = false;

	@Input()
	hide_question_text: boolean = false;

	@Output()
	onSaveClicked = new EventEmitter<any>();

	@ViewChildren("visibleChild")
	visibleChildrenList: QueryList<SaveableComponent>
	// questionInstances: NgForm = null;

	constructor(private router: Router, private wizardService: WizardService, private settingsService: SettingsService, private reportService: ReportService, private autoSaveService: AutoSaveService) {
	}

	ngOnInit() {

		// console.log('init wizard2: ' + this.treename);

		if (this.question_id == -1) {
			this.wizardService.getRootQuestion(this.treename, this.reference_table, this.reference_id, this.reference_string)
				.then((q: WizardQuestion[]) => {
					if (q.length > 0 && q[0].type == 'NAVIGATION') {
						this.question_id = q[0].id;
						this.init(q[0], q, q[0].display);
					}
					else {
						this.init(null, null, 'QUESTIONS');
					}
				});
		}
		else if (this.question_id != -1 && this.answer_id != -1) {
			this.wizardService.getQuestionAfterAnswer(this.question_id, this.answer_id, this.reference_table, this.reference_id, this.reference_string)
				.then((q: WizardQuestion[]) => {
					if (q.length > 0 && q[0].type == 'NAVIGATION') {
						this.init(q[0], q, q[0].display);
					}
					else {
						this.init(null, q, 'QUESTIONS');
					}
				});
		}

		this.settingsService.getObjectDetailShowTags()
			.then(s => this.showTags = s);
	}

	onClick(child_answer_id: number, child_answer_text: string) {
		this.multipageAnswerId = child_answer_id;
		this.multipageAnswerText = child_answer_text;
		this.multipageShowParent = false;
	}

	onClickBackBreadcrumb(event: any) {
		this.autoSaveService.saveImmediately()
			.then(() => {
				this.multipageShowParent = true;
			});
	}

	onClickAccordionHeading(event: any) {
		this.autoSaveService.saveImmediately();
	}

	init(question: WizardQuestion, questions: WizardQuestion[], display: string) {
		if (this.display == 'QUESTIONS') {
			this.autoSaveService.stopMonitoring();
		}
		this.wizardQuestion = question;
		this.wizardQuestions = questions;
		this.display = display;

		this.initProgress(null);
	}

	startMonitoring() {
		// console.log('starting monitoring : ' + this.reference_string);
		if (!this.read_only) {
			if (this.visibleChildrenList) {
				this.visibleChildrenList.forEach(child => {
					child.startMonitoring();
				});
			}
		}
	}

	save(): Promise<any> {
		return Promise.resolve();
	}

	initProgress(reference_string: string) {
		if (this.wizardQuestion != null && this.wizardQuestion.navigation_answers.length > 0) {
			this.reportService.getReport('report1')
				.then(r => {
					// console.log('initprogress : ' + reference_string);
					this.wizardQuestion.navigation_answers
						.filter(answer => {
							var ref_string = this.reference_string + '~' + this.wizardQuestion.id + '~' + '~' + answer.id + '~';
							return reference_string == null || ref_string == reference_string; //filter based on reference string;
						})
						.forEach(answer => {
							var ref_string = this.reference_string + '~' + this.wizardQuestion.id + '~' + '~' + answer.id + '~';
							var params = this.reference_table + ':' + this.reference_id + ':' + ref_string + ':' + this.tagfilterparameter;

							this.reportService.getData(r, params)
								.then((result: any) => {
									answer.no_of_answers = 0;
									answer.no_of_questions = 0;
									if (result != null && result.dataset1 != null) {
										result.dataset1.forEach(progress => {
											answer.no_of_answers += progress.answers;
											answer.no_of_questions += progress.questions;
										});
									}
									answer.normalized_no_of_questions = 5;
									answer.normalized_no_of_answers = (answer.no_of_answers / answer.no_of_questions) * answer.normalized_no_of_questions;
								});
						});
				});
		}
	}

	saveClicked(reference_string: string) {
		// console.log('wizard2 save : ' + this.reference_string + ' : event ref : ' + reference_string);
		setTimeout(() => {
			this.initProgress(reference_string);
		}, 2000);
		this.onSaveClicked.emit(this.reference_string);
	}

	reset() {
		this.question_id = -1;
		this.answer_id = -1;
		this.multipageShowParent = true;
		this.multipageAnswerId = -1;
		this.multipageAnswerText = '';
		this.ngOnInit();
	}

}