import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Project } from './project.class';
import { ProjectService } from './project.service';
import { ContentService } from './content.service';

@Component({
  selector: 'my-project',
  templateUrl: 'app_html/project.component.html'
})

export class ProjectComponent {

  @Input()
  project: Project;

  @Output()
  onDeleteClicked = new EventEmitter<any>();


  constructor(private router: Router, private projectService: ProjectService, private contentService: ContentService)
  {
  }
  
  goToDetails() {
    let link = ['/projects', this.project.id];
    this.router.navigate(link);
  }

  delete(project: Project): void {
    this.onDeleteClicked.emit(null);
  } 

  
}