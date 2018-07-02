import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { slideInDownAnimation } from './animations';

import { PartyAccount } from './partyaccount.class';
import { PartyAccountService } from './partyaccount.service';
import { MessageService } from './message.service';
import { ContentService } from './content.service';
import { SettingsService } from './settings.service';

// @Component({
//     templateUrl: 'app_html/partyaccountlogin.component.html',
//     animations: [slideInDownAnimation]
// })
@Component({
    templateUrl: 'app_html/partyaccountlogin.component.html'
})


export class PartyAccountLoginComponent implements OnInit {

    @Input()
    look: string;
    enabledHeading2: boolean = false;
    enabledHeading3: boolean = false;
    enabledHeading4: boolean = false;
    enabledHeading5: boolean = false;
    enabledHeading6: boolean = false;

    selectedHeading: string = "heading3";

    loginEmail: string;
    loginPassword: string;

    registerEmail: string;
    registerPassword: string;
    registerPassword2: string;
    acceptTerms: boolean;
    restoreConfirmationCode: string;
    restorePasswordEmail: string;
    restorePassword: string;
    restorePassword2: string;
    forgotPasswordEmail: string;

    fromEmail: string;

    constructor(private router: Router, private route: ActivatedRoute, private partyAccountService: PartyAccountService, private messageService: MessageService, private contentService: ContentService, private settingsService: SettingsService) {

    }

    ngOnInit() {
        this.settingsService.getPartyAccountEnableHeading2().then(s => this.enabledHeading2 = (s == 'Y'));
        this.settingsService.getPartyAccountEnableHeading3().then(s => this.enabledHeading3 = (s == 'Y'));
        this.settingsService.getPartyAccountEnableHeading4().then(s => this.enabledHeading4 = (s == 'Y'));
        this.settingsService.getPartyAccountEnableHeading5().then(s => this.enabledHeading5 = (s == 'Y'));
        this.settingsService.getPartyAccountEnableHeading6().then(s => this.enabledHeading6 = (s == 'Y'));
        this.settingsService.getEmailFromAdress().then(s => this.fromEmail = s);

        this.route.params.forEach((params: Params) => {
            // process optional confirmation
            let action: string = params['action'];
            if (action != null) {
                if (action == 'login') {
                    let email: string = params['param1'];
                    this.loginEmail = email;
                    this.selectedHeading = "heading3";
                }
                else if (action == 'register') {
                    let email: string = params['param1'];
                    this.registerEmail = email;
                    this.selectedHeading = "heading4";
                }
                else if (action == 'confirmregistration') {
                    let email: string = params['param1'];
                    let confirmationcode: string = params['param2'];
                    if (email != null && confirmationcode != null) {
                        this.confirmRegistration(email, confirmationcode);
                    }
                    this.selectedHeading = "heading4";
                }
                else if (action == 'restorepassword') {
                    let email: string = params['param1'];
                    this.restorePasswordEmail = email;
                    this.restoreConfirmationCode = params['param2'];
                    if (email != null && this.restoreConfirmationCode != null) {
                        // this.partyAccountService.forgotPassword()
                        this.selectedHeading = "heading5";
                    }
                    else {
                        // show error and go to login screen
                        // 2do: show error
                        this.selectedHeading = "heading3";
                    }
                }
                else if (action == 'forgotpassword') {
                    let email: string = params['param1'];
                    this.forgotPasswordEmail = email;
                    this.selectedHeading = "heading6";
                }
            }
        });
    }

    onSubmitSignIn() {
        this.partyAccountService.signIn(this.loginEmail, this.loginPassword)
            .then(b => {
                if (b == null) {
                    this.messageService.sendNotification("Gebruikersnaam of wachtwoord onbekend. Probeer het nog eens.", "");
                }
                else {

                    this.settingsService.reloadSettings()
                        .then((b: boolean) => {
                            if (this.partyAccountService.redirectUrl == null || this.partyAccountService.redirectUrl == undefined) {
                                this.partyAccountService.redirectUrl = '/objects';
                            }
                            this.router.navigateByUrl(this.partyAccountService.redirectUrl);
                        });
                }
            });
    }

    onSubmitRegister() {
        this.partyAccountService.register(this.registerEmail, this.registerPassword)
            .then(party => {
                this.messageService.sendNotification("Uw registratie is verwerkt... We hebben u een bevestigingsemail gestuurd.", "");
                this.router.navigate(['/partyaccountlogin']);
                this.reset();
            })
            .catch(e => {
                this.messageService.sendNotification("Er ging iets mis bij het verwerken van uw registratie... Neem a.u.b. contact op met " + this.fromEmail, "");
            });
    }

    confirmRegistration(email: string, confirmationcode: string) {
        this.partyAccountService.confirmRegistration(email, confirmationcode).then(b => {
            if (b == true) {
                this.messageService.sendNotification("Bedankt voor uw aanvraag. U kunt nu nog niet inloggen, uw aanvraag is in behandeling. U hoort spoedig van ons.", "");
            }
            else {
                this.messageService.sendNotification("Uw gebruikersnaam kon niet bevestigd worden. Neem a.u.b. contact op met " + this.fromEmail, "");
            }
            this.router.navigate(['/partyaccountlogin']);
        });
        this.reset();
    }

    reset() {
        this.look = null
        this.loginEmail = "";
        this.loginPassword = "";

        this.registerEmail = "";
        this.registerPassword = "";
        this.registerPassword2 = "";
        this.acceptTerms = false;

        this.restorePasswordEmail = "";
        this.restorePassword = "";
        this.restorePassword2 = "";
        this.forgotPasswordEmail = "";
    }

    onSubmitForgotPassword() {
        this.partyAccountService.forgotPassword(this.forgotPasswordEmail)
            .then(b => {
                if (b == true) {
                    this.messageService.sendNotification("We hebben u een email gestuurd met instructies over het herstellen van uw wachtwoord.", "");
                }
                else {
                    this.messageService.sendNotification("Uw wachtwoord kon niet hersteld worden. Neem a.u.b. contact op met " + this.fromEmail, "");
                }
                this.router.navigate(['/partyaccountlogin']);
                this.reset();
            })
            .catch(e => {
                this.messageService.sendNotification("Uw wachtwoord kon niet hersteld worden. Neem a.u.b. contact op met " + this.fromEmail + ".", "");
            });
    }

    onSubmitRestorePassword() {
        this.partyAccountService.restorePassword(this.restoreConfirmationCode, this.restorePasswordEmail, this.restorePassword)
            .then(b => {
                if (b == true) {
                    this.messageService.sendNotification("Uw wachtwoord is gewijzigd.", "");
                }
                else {
                    this.messageService.sendNotification("Uw wachtwoord kon niet gewijzigd worden. Neem a.u.b. contact op met " + this.fromEmail, "");
                }
                this.router.navigate(['/partyaccountlogin']);
                this.reset();
            })
            .catch(e => {
                this.messageService.sendNotification("Uw wachtwoord kon niet gewijzigd worden. Neem a.u.b. contact op met " + this.fromEmail, "");
            });
    }


    selectHeading(heading: string) {
        this.selectedHeading = heading;
    }

}