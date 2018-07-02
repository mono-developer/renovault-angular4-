import { Component, OnInit } from '@angular/core';
import { SettingsService } from './settings.service';
import { BreadcrumbsService } from './breadcrumbs.service';

@Component({
  selector: 'breadcrumbs',
  templateUrl: 'app_html/breadcrumbs.component.html'
})


export class BreadcrumbsComponent implements OnInit {

  constructor(private settingsService: SettingsService, public breadcrumbsService: BreadcrumbsService) {
  }

  ngOnInit() {
    // this.settingsService.getMenuEnableHome().then(s => this.enabled = (s == 'Y'));
  }


}