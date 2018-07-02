import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { BeanService } from './bean.service';
import { MessageService } from './message.service';
import { WizardQuestion } from './wizardquestion.class';
import { QuestionInstance } from './questioninstance.class';
import { Question } from './question.class';

@Injectable()
export class WizardService extends BeanService {

	protected apiName = 'questions';
	private question: WizardQuestion;

	constructor(protected http: Http, protected messageService: MessageService) {
		super(http, messageService);
	}

	getApiName(): string {
		return this.apiName;
	}

	getNextQuestion() {
		return this.http.get(this.getApiUrl() + '/next')
			.toPromise()
			.then((response: Response) => {
				this.question = response.json().data as WizardQuestion;
				return this.question;
			})
			.catch((error: any) => this.handleError(error));
	}

	resetQuestions() {
		return this.http.get(this.getApiUrl() + '/reset')
			.toPromise()
			.then()
			.catch((error: any) => this.handleError(error));
	}


	answerQuestion(question: number, answer: number) {
		return this.http.post(this.getApiUrl() + '/answer/' + question + '/' + answer, {}, this.options)
			.toPromise()
			.then((response: Response) => {
				this.question = response.json().data as WizardQuestion;
				return this.question;
			})
			.catch((error: any) => this.handleError(error));
	}

	getRootQuestion(treename: string, reference_table: string, reference_id: number, reference_string: string) {
		return this.http.get(this.getApiUrl() + '/root/' + treename + '/' + reference_table + '/' + reference_id + '/' + reference_string)
			.toPromise()
			.then((response: Response) => {
				return response.json().data as WizardQuestion[];
			})
			.catch((error: any) => this.handleError(error));
	}

	getQuestionsWithTag(tagname: string) {
		return this.http.get(this.getApiUrl() + '/tagged/' + tagname)
			.toPromise()
			.then((response: Response) => {
				this.question = response.json().data as WizardQuestion;
				return this.question;
			})
			.catch((error: any) => this.handleError(error));
	}

	getQuestionAfterAnswer(question_id: number, answer_id: number, reference_table: string, reference_id: number, reference_string: string) {
		return this.http.get(this.getApiUrl() + '/after/' + question_id + '/' + answer_id + '/' + reference_table + '/' + reference_id + '/' + reference_string)
			.toPromise()
			.then((response: Response) => {
				return response.json().data as WizardQuestion[];
			})
			.catch((error: any) => this.handleError(error));
	}

	// getQuestionInstances(reference_table: string, reference_id: number, reference_string: string) {
	// 	return this.http.get(this.getApiUrl() + '/instances/' + reference_table + '/' + reference_id + '/' + reference_string)
	// 		.toPromise()
	// 		.then((response: Response) => response.json().data as QuestionInstance[])
	// 		.catch((error: any) => this.handleError(error));
	// }

	getQuestionInstance(reference_table: string, reference_id: number, reference_string: string, question_id: number) {
		return this.http.get(this.getApiUrl() + '/questioninstance/' + reference_table + '/' + reference_id + '/' + reference_string + '/' + question_id)
			.toPromise()
			.then((response: Response) => response.json().data as QuestionInstance)
			.catch((error: any) => this.handleError(error));
	}

	updateQuestionInstance(instance: QuestionInstance) {
		return this.http.post(this.getApiUrl() + '/questioninstance/' + instance.id, JSON.stringify(instance), this.options)
			.toPromise()
			.then((response: Response) => response.json().data as QuestionInstance)
			.catch((error: any) => this.handleError(error));
	}

	updateQuestionInstances(instances: Array<QuestionInstance>) {
		return this.http.post(this.getApiUrl() + '/questioninstance/multiple', JSON.stringify(instances), this.options)
			.toPromise()
			.then((response: Response) => response.json().data as QuestionInstance)
			.catch((error: any) => this.handleError(error));
	}

	// getQuestionProgress(reference_table: string, reference_id: number, reference_string: string) {
	// 	var url: string = this.getApiUrl() + '/progress/' + reference_table + '/' + reference_id + '/' + reference_string;
	// 	return this.http.get(url)
	// 		.toPromise()
	// 		.then((response: Response) => response.json().data as QuestionInstance[])
	// 		.catch((error: any) => this.handleError(error));
	// }

	getQuestion(id: number) {
		return this.http.get(this.getApiUrl() + '/' + id)
			.toPromise()
			.then((response: Response) => {
				return response.json().data as Question;
			})
			.catch((error: any) => this.handleError(error));
	}
}