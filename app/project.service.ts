import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Project } from './project.class';
import { BeanService } from './bean.service';
import { MessageService } from './message.service';

@Injectable()
export class ProjectService extends BeanService {

	protected apiName = 'project';

	constructor(protected http: Http, protected messageService: MessageService) {
		super(http, messageService);
	}

	getApiName(): string {
		return this.apiName;
	}

	getProjects() {
	  return this.getBeans();
	}

	getProject(id: number)
	{
		 return this.getBean(id);
	}

	deleteProject(projectToDelete: Project): Promise<Project> {
		return this.deleteBean(projectToDelete).then(project => {
			// this.objects = this.objects.filter(o => o.id !== projectToDelete.id);
			// this.selectedObjects = this.selectedObjects.filter(o => o.id !== projectToDelete.id);
			return project;
		}); 
	} 

	updateProject(project: Project): Promise<Project> {
		return this.updateBean(project);
	} 


	addNewProject(): Promise<Project> {
		var p: Project = new Project();

		return this.http
			.post(this.getApiUrl() + '/createNewFromSession', JSON.stringify(p), {headers: this.headers})
			.toPromise()
			.then((response: Response) => { 
					return response.json().data as Project;
				})
			.catch((error: any) => this.handleError(error));		
	}
	
}