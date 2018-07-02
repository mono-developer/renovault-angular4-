import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';

import { Project } from './project.class';
import { ProjectService } from './project.service';
import { ContentService } from './content.service';
import { SettingsService } from './settings.service';

@Component({
	selector: 'projectdetail',
	templateUrl: 'app_html/projectdetail.component.html'
})

export class ProjectDetailComponent implements OnInit {

	enabled: boolean = false;
	project: Project;

	selectedTab: number;

	constructor(private router: Router, private projectService: ProjectService, private route: ActivatedRoute, private contentService: ContentService, private settingsService: SettingsService)
	{
	}

	ngOnInit()
	{
		this.settingsService.getMenuEnableProjects().then(s => this.enabled = (s == 'Y'));

		this.route.params.forEach((params: Params) => {
			let id = +params['id'];
			this.projectService.getProject(id).then(project => { 
				this.project = project;
				if (!this.project.phase.general) 
				{
					this.selectedTab = 1;
				}
				else if (!this.project.phase.preparation)
				{
					this.selectedTab = 2;
				} 
				else if (!this.project.phase.execution)
				{
					this.selectedTab = 3;
				} 
				else if (!this.project.phase.handover)
				{
					this.selectedTab = 4;
				} 
				else
				{
					this.selectedTab = 5;
				}
			});
		});
	}

	save()
	{
		this.projectService.updateProject(this.project)
		.then(project => this.project = project);
	}

}