import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { ObjectBean } from './objectbean.class';
import { ObjectService } from './object.service';
import { ContentService } from './content.service';

@Component({
  selector: 'object',
  templateUrl: 'app_html/object.component.html'
})

export class ObjectComponent implements OnInit {

  @Input()
  object: ObjectBean;

  @Input()
  look: string;

  @Output()
  onDeleteClicked = new EventEmitter<any>();

  isSelected: boolean = false;

  constructor(private router: Router, private objectService: ObjectService, private contentService: ContentService) {
  }

  ngOnInit() {
    this.isSelected = this.objectService.isObjectSelected(this.object);
  }

  goToDetails() {
    let link = ['/objects', this.object.id];
    this.router.navigate(link);
  }

  toggleSelected() {
    this.objectService.toggleObjectSelection(this.object);
    this.isSelected = this.objectService.isObjectSelected(this.object);
  }

  delete(object: Object): void {
    this.onDeleteClicked.emit(null);
  }

}