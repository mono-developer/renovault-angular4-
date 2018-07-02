import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Bean } from './bean.class';
import { Hoa } from './hoa.class';
import { HoaService } from './hoa.service';
import { PartyAccountService } from './partyaccount.service';
import { ContentService } from './content.service';
import { SettingsService } from './settings.service';
import { BreadcrumbsService } from './breadcrumbs.service';
import { ShareComponent } from './share.component';

@Component({
  selector: 'hoas',
  templateUrl: 'app_html/hoas.component.html'
})

export class HoasComponent implements OnInit {

  hoas: Hoa[];
  selectedHoas: Hoa[];
  enabled: boolean = false;

  @Input()
  look: string;

  @ViewChild(ShareComponent)
  shareComponent: ShareComponent;

  constructor(private router: Router, private hoaService: HoaService, private partyAccountService: PartyAccountService, private contentService: ContentService, private settingsService: SettingsService, private breadcrumbsService: BreadcrumbsService) {
  }

  ngOnInit() {
    this.settingsService.getMenuEnableHoas().then(s => this.enabled = (s == 'Y'));
    this.forceUpdate();

    this.contentService.getContentItem('app.menu.hoas')
      .then(s => {
        this.breadcrumbsService.reset();
        this.breadcrumbsService.pushCrumb(s, '/hoas');
      });
  }

  addNewHoa() {
    this.hoaService.addNewHoa()
      .then(() => {
        this.forceUpdate();
      })
  }

  delete(event: any, o: Hoa) {
    this.hoaService.deleteHoa(o)
      .then(() => {
        this.forceUpdate();
      })
      ;
    event.stopPropagation();
  }

  share(event: any, o: Hoa) {
    // console.log('hoas.component.ts: sharecomponent should show now...');
    this.shareComponent.show(o);
    event.stopPropagation();
  }

  goToDetails(o: Hoa) {
    let link = ['/hoas', o.id];
    this.router.navigate(link);
  }

  forceUpdate() {
    this.hoas = new Array<Hoa>();
    this.selectedHoas = new Array<Hoa>();

    this.hoaService.getHoas().then(hoas => {
      this.hoas = hoas.sort((a: Bean, b: Bean) => {
        let toReturn: number = 0;
        let name_a: string = a.getDisplayString().toLowerCase();
        let name_b: string = b.getDisplayString().toLowerCase();
        if (name_a > name_b) {
          toReturn = 1;
        } else if (name_b > name_a) {
          toReturn = -1;
        }
        // console.log('comparing: ' + name_a + ' to ' + name_b + ' => ' + toReturn);
        return toReturn;
      });

    });
    this.hoaService.getSelectedHoas().then(hoas => this.selectedHoas = hoas);
  }

  getHoaAddress(o: Hoa): string {
    if (this.hoaHasAddress(o)) {
      return o.getAddressDescription();
    }
    return '(voer adresgegevens in)';
  }

  hoaHasAddress(o: Hoa): boolean {
    return o != null && o.hasAddress();
  }

  allowNewHoa() {
    let allow = true;
    if (this.hoas) {
      this.hoas.forEach((o: Hoa) => {
        if (!this.hoaHasAddress(o)) {
          allow = false;
        }
      });
    }
    return allow;
  }

}