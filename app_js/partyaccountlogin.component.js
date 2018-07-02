"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var partyaccount_service_1 = require("./partyaccount.service");
var message_service_1 = require("./message.service");
var content_service_1 = require("./content.service");
var settings_service_1 = require("./settings.service");
// @Component({
//     templateUrl: 'app_html/partyaccountlogin.component.html',
//     animations: [slideInDownAnimation]
// })
var PartyAccountLoginComponent = /** @class */ (function () {
    function PartyAccountLoginComponent(router, route, partyAccountService, messageService, contentService, settingsService) {
        this.router = router;
        this.route = route;
        this.partyAccountService = partyAccountService;
        this.messageService = messageService;
        this.contentService = contentService;
        this.settingsService = settingsService;
        this.enabledHeading2 = false;
        this.enabledHeading3 = false;
        this.enabledHeading4 = false;
        this.enabledHeading5 = false;
        this.enabledHeading6 = false;
        this.selectedHeading = "heading3";
    }
    PartyAccountLoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.settingsService.getPartyAccountEnableHeading2().then(function (s) { return _this.enabledHeading2 = (s == 'Y'); });
        this.settingsService.getPartyAccountEnableHeading3().then(function (s) { return _this.enabledHeading3 = (s == 'Y'); });
        this.settingsService.getPartyAccountEnableHeading4().then(function (s) { return _this.enabledHeading4 = (s == 'Y'); });
        this.settingsService.getPartyAccountEnableHeading5().then(function (s) { return _this.enabledHeading5 = (s == 'Y'); });
        this.settingsService.getPartyAccountEnableHeading6().then(function (s) { return _this.enabledHeading6 = (s == 'Y'); });
        this.settingsService.getEmailFromAdress().then(function (s) { return _this.fromEmail = s; });
        this.route.params.forEach(function (params) {
            // process optional confirmation
            var action = params['action'];
            if (action != null) {
                if (action == 'login') {
                    var email = params['param1'];
                    _this.loginEmail = email;
                    _this.selectedHeading = "heading3";
                }
                else if (action == 'register') {
                    var email = params['param1'];
                    _this.registerEmail = email;
                    _this.selectedHeading = "heading4";
                }
                else if (action == 'confirmregistration') {
                    var email = params['param1'];
                    var confirmationcode = params['param2'];
                    if (email != null && confirmationcode != null) {
                        _this.confirmRegistration(email, confirmationcode);
                    }
                    _this.selectedHeading = "heading4";
                }
                else if (action == 'restorepassword') {
                    var email = params['param1'];
                    _this.restorePasswordEmail = email;
                    _this.restoreConfirmationCode = params['param2'];
                    if (email != null && _this.restoreConfirmationCode != null) {
                        // this.partyAccountService.forgotPassword()
                        _this.selectedHeading = "heading5";
                    }
                    else {
                        // show error and go to login screen
                        // 2do: show error
                        _this.selectedHeading = "heading3";
                    }
                }
                else if (action == 'forgotpassword') {
                    var email = params['param1'];
                    _this.forgotPasswordEmail = email;
                    _this.selectedHeading = "heading6";
                }
            }
        });
    };
    PartyAccountLoginComponent.prototype.onSubmitSignIn = function () {
        var _this = this;
        this.partyAccountService.signIn(this.loginEmail, this.loginPassword)
            .then(function (b) {
            if (b == null) {
                _this.messageService.sendNotification("Gebruikersnaam of wachtwoord onbekend. Probeer het nog eens.", "");
            }
            else {
                _this.settingsService.reloadSettings()
                    .then(function (b) {
                    if (_this.partyAccountService.redirectUrl == null || _this.partyAccountService.redirectUrl == undefined) {
                        _this.partyAccountService.redirectUrl = '/objects';
                    }
                    _this.router.navigateByUrl(_this.partyAccountService.redirectUrl);
                });
            }
        });
    };
    PartyAccountLoginComponent.prototype.onSubmitRegister = function () {
        var _this = this;
        this.partyAccountService.register(this.registerEmail, this.registerPassword)
            .then(function (party) {
            _this.messageService.sendNotification("Uw registratie is verwerkt... We hebben u een bevestigingsemail gestuurd.", "");
            _this.router.navigate(['/partyaccountlogin']);
            _this.reset();
        })
            .catch(function (e) {
            _this.messageService.sendNotification("Er ging iets mis bij het verwerken van uw registratie... Neem a.u.b. contact op met " + _this.fromEmail, "");
        });
    };
    PartyAccountLoginComponent.prototype.confirmRegistration = function (email, confirmationcode) {
        var _this = this;
        this.partyAccountService.confirmRegistration(email, confirmationcode).then(function (b) {
            if (b == true) {
                _this.messageService.sendNotification("Bedankt voor uw aanvraag. U kunt nu nog niet inloggen, uw aanvraag is in behandeling. U hoort spoedig van ons.", "");
            }
            else {
                _this.messageService.sendNotification("Uw gebruikersnaam kon niet bevestigd worden. Neem a.u.b. contact op met " + _this.fromEmail, "");
            }
            _this.router.navigate(['/partyaccountlogin']);
        });
        this.reset();
    };
    PartyAccountLoginComponent.prototype.reset = function () {
        this.look = null;
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
    };
    PartyAccountLoginComponent.prototype.onSubmitForgotPassword = function () {
        var _this = this;
        this.partyAccountService.forgotPassword(this.forgotPasswordEmail)
            .then(function (b) {
            if (b == true) {
                _this.messageService.sendNotification("We hebben u een email gestuurd met instructies over het herstellen van uw wachtwoord.", "");
            }
            else {
                _this.messageService.sendNotification("Uw wachtwoord kon niet hersteld worden. Neem a.u.b. contact op met " + _this.fromEmail, "");
            }
            _this.router.navigate(['/partyaccountlogin']);
            _this.reset();
        })
            .catch(function (e) {
            _this.messageService.sendNotification("Uw wachtwoord kon niet hersteld worden. Neem a.u.b. contact op met " + _this.fromEmail + ".", "");
        });
    };
    PartyAccountLoginComponent.prototype.onSubmitRestorePassword = function () {
        var _this = this;
        this.partyAccountService.restorePassword(this.restoreConfirmationCode, this.restorePasswordEmail, this.restorePassword)
            .then(function (b) {
            if (b == true) {
                _this.messageService.sendNotification("Uw wachtwoord is gewijzigd.", "");
            }
            else {
                _this.messageService.sendNotification("Uw wachtwoord kon niet gewijzigd worden. Neem a.u.b. contact op met " + _this.fromEmail, "");
            }
            _this.router.navigate(['/partyaccountlogin']);
            _this.reset();
        })
            .catch(function (e) {
            _this.messageService.sendNotification("Uw wachtwoord kon niet gewijzigd worden. Neem a.u.b. contact op met " + _this.fromEmail, "");
        });
    };
    PartyAccountLoginComponent.prototype.selectHeading = function (heading) {
        this.selectedHeading = heading;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], PartyAccountLoginComponent.prototype, "look", void 0);
    PartyAccountLoginComponent = __decorate([
        core_1.Component({
            templateUrl: 'app_html/partyaccountlogin.component.html'
        }),
        __metadata("design:paramtypes", [router_1.Router, router_1.ActivatedRoute, partyaccount_service_1.PartyAccountService, message_service_1.MessageService, content_service_1.ContentService, settings_service_1.SettingsService])
    ], PartyAccountLoginComponent);
    return PartyAccountLoginComponent;
}());
exports.PartyAccountLoginComponent = PartyAccountLoginComponent;
