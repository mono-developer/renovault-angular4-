import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Template } from './template.class';

@Component({
  selector: 'my-template',
  templateUrl: 'app_html/template.component.html',
  styleUrls: ['app_html/template.component.css']
})

export class TemplateComponent implements OnInit {

  field: string;
  aTemplateObject: Template;

  constructor(private router: Router)
  {
  }
  
  ngOnInit() 
  {
  	this.field = "een veld..."; 
  	this.aTemplateObject = {
  		id: 1,
  		name: "jajaja",
  		anotherProperty: "property"
  	}
  }

}