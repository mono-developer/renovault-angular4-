import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ContentService } from './content.service';
import { SettingsService } from './settings.service';
import { SecurityService } from './security.service';
import { MessageService } from './message.service';
import { ModalDirective } from 'ngx-bootstrap'
import { TypeaheadComponent } from './typeahead.component'

import { Bean } from './bean.class'
import { Security } from './security.class'
import { Party } from './party.class'

@Component({
    selector: 'share',
    templateUrl: 'app_html/share.component.html'
})

export class ShareComponent implements OnInit {

    private enabled: boolean = true;

    private bean: Bean;

    private securityRecords: Security[] = null;

    private ownSecurityRecord: Security = null;

    private selectedSecurityRecord: number = null;

    @ViewChild(ModalDirective)
    modal: ModalDirective;

    @ViewChild(TypeaheadComponent)
    typeaheadComponent: TypeaheadComponent;

    constructor(private router: Router, private contentService: ContentService, private settingsService: SettingsService, private securityService: SecurityService, private messageService: MessageService) {
    }

    ngOnInit() {
        // this.forceUpdate();
    }

    show(o: Bean) {
        this.bean = o;
        if (this.bean != null) {
            this.securityService.getSecurityForTable(this.bean.getTable(), this.bean.getId())
                .then(s => {
                    let ownSecurityRecords: Security[];
                    this.securityRecords = s.filter(s => s.granteerole != 'owner');
                    ownSecurityRecords = s.filter(s => s.granteerole == 'owner');
                    if (ownSecurityRecords.length == 1) {
                        this.ownSecurityRecord = ownSecurityRecords[0];
                    }
                });
        }

        if (this.typeaheadComponent) {
            this.typeaheadComponent.reset();
        }
        this.modal.show();
    }

    hide() {
        this.modal.hide();
    }

    selected(s: any) {
        // console.log(s);
    }

    add(selectedParty: Party) {
        let s: Security = new Security();

        s.granteelogin = selectedParty.email;
        s.granteerole = 'read';
        s.referencetable = this.bean.getTable();
        s.referenceid = this.bean.getId();

        this.securityService.addNewSecurity(s)
            .then(s => {
                if (s != null) {
                    this.securityRecords.push(s);
                    if (this.typeaheadComponent) {
                        this.typeaheadComponent.reset();
                    }
                }
                else {
                    this.hide();
                }
            });
    }

    findInSecurityRecords(email: string): Security {
        let securityRecord: Security = this.securityRecords.find(s => s.granteelogin == email)
        return securityRecord;
    }

    delete(event: any, o: Security) {
        this.securityService.deleteSecurity(o)
            .then(s => {
                if (s != null) {
                    this.securityRecords = this.securityRecords.filter(r => r != o);
                }
                else {
                    this.hide();
                }
            })
            ;
        event.stopPropagation();
    }

    toggleSelect(event: any, o: Security) {
        if (this.selectedSecurityRecord == o.id) {
            this.selectedSecurityRecord = null;
        }
        else {
            this.selectedSecurityRecord = o.id;
        }
        // this.securityService.deleteSecurity(o)
        //     .then(s => {
        //         if (s != null) {
        //             this.securityRecords = this.securityRecords.filter(r => r != o);
        //         }
        //         else {
        //             this.hide();
        //         }
        //     })
        //     ;
        event.stopPropagation();
    }

    transfer(event: any, to: Security) {
        this.securityService.transferSecurity(this.ownSecurityRecord, to)
            .then(s => {
                this.hide();
                this.messageService.sendMessage("Overdracht aan " + to.granteelogin + " voltooid.", "");
                this.bean.setGranteerole(to.granteerole);
            })
            ;
        event.stopPropagation();
    }

    securityClick(event: any) {
        event.stopPropagation();
    }

}