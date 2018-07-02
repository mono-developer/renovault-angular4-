import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { PartyAccountService } from './partyaccount.service';
import { Setting } from './setting.class';
import { ContentService } from './content.service';
import { SettingsService } from './settings.service';

@Component({
  selector: 'my-app',
  templateUrl: 'app_html/app.component.html'
})

export class AppComponent implements OnInit {

  private enableHome: boolean = false;
  private enableObjects: boolean = false;
  private enableProjects: boolean = false;
  private enableParties: boolean = false;
  private enablePartyAccount: boolean = false;

  public constructor(private partyAccountService: PartyAccountService, private contentService: ContentService, private settingsService: SettingsService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.settingsService.getMenuEnableHome().then(s => this.enableHome = (s == 'Y'));
    this.settingsService.getMenuEnableObjects().then(s => this.enableObjects = (s == 'Y'));
    this.settingsService.getMenuEnableProjects().then(s => this.enableProjects = (s == 'Y'));
    this.settingsService.getMenuEnableParties().then(s => this.enableParties = (s == 'Y'));
    this.settingsService.getMenuEnablePartyAccount().then(s => this.enablePartyAccount = (s == 'Y'));

    // console.log(this.route);

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }

      window.scrollTo(0, 0)
    });

  }


  onActivateRouterOutlet(component: any) {
    let homeComps: any = document.getElementsByTagName("home");
    let homePrerender: any = document.getElementById("homePrerender");

    if (component.isHomeComponent) {
      homePrerender.style.display = null;
    }
    else {
      homePrerender.style.display = "none";
    }
  }

  // ngAfterViewInit() {
  // }

}