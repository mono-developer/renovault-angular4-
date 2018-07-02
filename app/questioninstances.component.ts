import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { QuestionInstanceComponent } from './questioninstance.component';

import { QuestionInstance } from './questioninstance.class';
import { WizardQuestion } from './wizardquestion.class';
import { WizardService } from './wizard.service';
import { SaveableComponent } from './saveablecomponent.class';
import { AutoSaveService } from './autosave.service';

@Component({
	selector: 'questioninstances',
	templateUrl: 'app_html/questioninstances.component.html'
})

export class QuestionInstancesComponent implements OnInit, OnDestroy, SaveableComponent {

	@Input()
	reference_table: string;

	@Input()
	reference_id: number;

	@Input()
	reference_string: string;

	@Input()
	read_only: boolean = false;

	@Output()
	onSaveClicked = new EventEmitter<any>();

	// @Output()
	// onQuestionInstanceChanged = new EventEmitter<any>();

	@Input()
	wizardQuestions: WizardQuestion[];

	@ViewChildren(QuestionInstanceComponent)
	questionInstanceComponents: QueryList<QuestionInstanceComponent>;

	@ViewChildren("questionInstancesForm")
	questionInstancesForms: QueryList<NgForm>
	questionInstancesForm: NgForm = null;

	constructor(private router: Router, private wizardService: WizardService, private autoSaveService: AutoSaveService) {
	}

	ngOnInit() {
	}

	ngOnDestroy() {
		this.stopMonitoring();
	}

	save(): Promise<any> {

		let arr: Array<QuestionInstance> = [];

		this.questionInstanceComponents.forEach(component => {
			arr.push(component.instance);
		})

		return this.wizardService.updateQuestionInstances(arr)
			.then(result => {
				this.onSaveClicked.emit(this.reference_string);
			});
	}

	// onChange() {
	// 	this.onQuestionInstanceChanged.emit(this.reference_string);
	// }

	ngAfterViewInit() {
		if (this.questionInstancesForm == null && this.questionInstancesForms.first) {
			this.questionInstancesForm = this.questionInstancesForms.first;
			this.startMonitoring();
		}
	}

	startMonitoring() {
		if (this.questionInstancesForm != null && !this.read_only) {
			this.autoSaveService.startMonitoring(this, this.questionInstancesForm);
		}
	}

	stopMonitoring() {
		this.autoSaveService.stopMonitoring();
	}

}