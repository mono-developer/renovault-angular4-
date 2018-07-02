import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Bean } from './bean.class';
import { ObjectBean } from './objectbean.class';
import { ObjectService } from './object.service';
import { PartyAccountService } from './partyaccount.service';
import { ContentService } from './content.service';
import { SettingsService } from './settings.service';
import { BreadcrumbsService } from './breadcrumbs.service';
import { ShareComponent } from './share.component';

@Component({
  selector: 'objects',
  templateUrl: 'app_html/objects.component.html'
})

export class ObjectsComponent implements OnInit {

  objects: ObjectBean[];
  selectedObjects: ObjectBean[];
  enabled: boolean = false;

  @Input()
  look: string;

  @ViewChild(ShareComponent)
  shareComponent: ShareComponent;

  constructor(private router: Router, private objectService: ObjectService, private partyAccountService: PartyAccountService, private contentService: ContentService, private settingsService: SettingsService, private breadcrumbsService: BreadcrumbsService) {
  }

  ngOnInit() {
    this.settingsService.getMenuEnableObjects().then(s => this.enabled = (s == 'Y'));
    this.forceUpdate();

    this.contentService.getContentItem('app.menu.objects')
      .then(s => {
        this.breadcrumbsService.reset();
        this.breadcrumbsService.pushCrumb(s, '/objects');
      });
  }

  addNewObject() {
    this.objectService.addNewObject()
      .then(() => {
        this.forceUpdate();
      })
  }

  delete(event: any, o: ObjectBean) {
    this.objectService.deleteObject(o)
      .then(() => {
        this.forceUpdate();
      })
      ;
    event.stopPropagation();
  }

  share(event: any, o: ObjectBean) {
    this.shareComponent.show(o);
    event.stopPropagation();
  }

  goToDetails(o: ObjectBean) {
    let link = ['/objects', o.id];
    this.router.navigate(link);
  }

  forceUpdate() {
    this.objects = new Array<ObjectBean>();
    this.selectedObjects = new Array<ObjectBean>();

    this.objectService.getObjects().then(objects => {
      this.objects = objects;

      this.objects = objects.sort((a: Bean, b: Bean) => {
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

      // this.partyAccountService.getSignedInPartyAccount().then(party => {
      //   if (party.multipleobjects == false) {
      //     let link = ['/objects', this.objects[0].id];
      //     this.router.navigate(link);
      //   }
      // });

    });
    this.objectService.getSelectedObjects().then(objects => this.selectedObjects = objects);
  }

  getObjectAddress(o: ObjectBean): string {
    if (this.objectHasAddress(o)) {
      return o.getAddressDescription();
    }
    return '(voer adresgegevens in)';
  }

  objectHasAddress(o: ObjectBean): boolean {
    return o != null && o.hasAddress();
  }

  allowNewObject() {
    let allow = true;
    if (this.objects) {
      this.objects.forEach((o: ObjectBean) => {
        if (!this.objectHasAddress(o)) {
          allow = false;
        }
      });
    }
    return allow;
  }

}