import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PartyAccountService } from './partyaccount.service';
import { Setting } from './setting.class';
import { ContentService } from './content.service';
import { SettingsService } from './settings.service';
import { AutoSaveService } from './autosave.service';

@Component({
  selector: 'app-menu',
  templateUrl: 'app_html/appmenu.component.html'
})

export class AppMenuComponent implements OnInit {

  private enableHome: boolean = false;
  private enableObjects: boolean = false;
  private enableHoas: boolean = false;
  private enableProjects: boolean = false;
  private enableParties: boolean = false;
  private enablePartyAccount: boolean = false;

  public constructor(private partyAccountService: PartyAccountService, private contentService: ContentService, private settingsService: SettingsService, private router: Router, private autoSaveService: AutoSaveService) {
  }

  ngOnInit() {
    this.settingsService.getMenuEnableHome().then(s => this.enableHome = (s == 'Y'));
    this.settingsService.getMenuEnableObjects().then(s => this.enableObjects = (s == 'Y'));
    this.settingsService.getMenuEnableHoas().then(s => this.enableHoas = (s == 'Y'));
    this.settingsService.getMenuEnableProjects().then(s => this.enableProjects = (s == 'Y'));
    this.settingsService.getMenuEnableParties().then(s => this.enableParties = (s == 'Y'));
    this.settingsService.getMenuEnablePartyAccount().then(s => this.enablePartyAccount = (s == 'Y'));
  }

  onAutoSaveClick(event: any) {
    this.autoSaveService.logStuff();
    event.preventDefault();
  }

}