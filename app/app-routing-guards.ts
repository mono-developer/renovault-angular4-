import { Injectable, Component } from '@angular/core';
import { Router, CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Params } from '@angular/router';
import { PartyAccountService } from './partyaccount.service';
import { ObjectService } from './object.service';
import { HoaService } from './hoa.service';
import { BreadcrumbsService } from './breadcrumbs.service';
import { AutoSaveService } from './autosave.service';
import { MessageService } from './message.service';

@Injectable()
export class NoPartyAccountGuard implements CanActivate {

    constructor(private router: Router, private partyAccountService: PartyAccountService, private breadcrumbsService: BreadcrumbsService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.partyAccountService.getPartyAccountIsSignedIn()
            .then(partyIsSignedIn => {
                // console.log('NoPartyAccountGuard');
                // console.log(state.url);
                if (!partyIsSignedIn) {
                    // console.log('no party signed in');
                    this.breadcrumbsService.reset();
                    this.partyAccountService.redirectUrl = state.url;
                    // console.log('redirecting to login page');
                    this.router.navigate(['/partyaccountlogin']);
                    return false;
                }
                return true;
            });
    }
}

@Injectable()
export class PartyAccountGuard implements CanActivate {

    constructor(private router: Router, private partyAccountService: PartyAccountService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.partyAccountService.getPartyAccountIsSignedIn()
            .then(partyIsSignedIn => {
                // console.log('PartyAccountGuard');
                // console.log(state.url);
                if (partyIsSignedIn) {
                    // console.log('a party is signed in, redirecting to objects');
                    this.router.navigate(['/objects']);
                    return false;
                }
                return true;
            });
    }
}

@Injectable()
export class SettingsGuard implements CanActivate {

    constructor(private partyAccountService: PartyAccountService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // check settings here
        return true;
    }
}

@Injectable()
export class ObjectGuard implements CanActivate {

    constructor(private router: Router, private partyAccountService: PartyAccountService, private objectService: ObjectService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.partyAccountService.getSignedInPartyAccount()
            .then(party => {
                if (party != null) {
                    if (party.multipleobjects == false) {

                        return this.objectService.getObjects()
                            .then(objects => {
                                let link = ['/objects', objects[0].id, { selectedHeading: "heading1" }];
                                this.router.navigate(link);
                                return false;
                            });
                    }
                    else {
                        let id = route.params['id'];
                        let selectedHeading = route.params['selectedHeading'];
                        if (id && !selectedHeading) {
                            let link = ['/objects', id, { selectedHeading: "heading1" }];
                            this.router.navigate(link);
                            return false;
                        }
                    }
                }
                return true;
            });
    }
}

@Injectable()
export class HoaGuard implements CanActivate {

    constructor(private router: Router, private partyAccountService: PartyAccountService, private hoaService: HoaService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.partyAccountService.getSignedInPartyAccount()
            .then(party => {
                if (party != null) {
                    if (party.multipleobjects == false) {

                        return this.hoaService.getHoas()
                            .then(hoas => {
                                let link = ['/hoas', hoas[0].id, { selectedHeading: "heading1" }];
                                this.router.navigate(link);
                                return false;
                            });
                    }
                    else {
                        let id = route.params['id'];
                        let selectedHeading = route.params['selectedHeading'];
                        if (id && !selectedHeading) {
                            let link = ['/hoas', id, { selectedHeading: "heading1" }];
                            this.router.navigate(link);
                            return false;
                        }
                    }
                }
                return true;
            });
    }
}


@Injectable()
export class AutoSaveStopMonitoringGuard implements CanDeactivate<Component> {

    constructor(private autoSaveService: AutoSaveService, private messageService: MessageService) {
    }

    canDeactivate(component: Component, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.autoSaveService.saveImmediately()
            .then(() => {
                // this.autoSaveService.stopMonitoring();
            });
        return true;
    }
}
