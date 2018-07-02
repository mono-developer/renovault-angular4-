import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Project } from './project.class';
import { ProjectService } from './project.service';
import { WizardComponent } from './wizard.component';
import { ContentService } from './content.service';
import { SettingsService } from './settings.service';

@Component({
  templateUrl: 'app_html/projects.component.html'
})

export class ProjectsComponent implements OnInit 
{
  projects: Project[];
  @ViewChild(WizardComponent)
  wizardComponent: WizardComponent;
  enabled: boolean = false;

  constructor(private router: Router, private projectService: ProjectService, private contentService: ContentService, private settingsService: SettingsService)
  {
  }

  ngOnInit() 
  {
  	this.settingsService.getMenuEnableProjects().then(s => this.enabled = (s == 'Y'));
  	this.forceUpdate();
  }

  addNewProject () 
  {
    this.wizardComponent.show();
  }

  delete(o: Project) {
    this.projectService.deleteProject(o)
      .then(() => { 
  	    this.forceUpdate();
      })
    ;
  }

  forceUpdate()
  {
    this.projects = new Array<Project>();
    this.projectService.getProjects().then(projects => this.projects = projects);
  }



  wizardDone() {
    this.projectService.addNewProject().then(project => {
      let link = ['/projects/' + project.id ];
      this.router.navigate(link);
    });
  }
  
}