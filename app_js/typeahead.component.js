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
var forms_1 = require("@angular/forms");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
var party_class_1 = require("./party.class");
var party_service_1 = require("./party.service");
var object_service_1 = require("./object.service");
var content_service_1 = require("./content.service");
var message_service_1 = require("./message.service");
var TypeaheadComponent = /** @class */ (function () {
    function TypeaheadComponent(partyService, objectService, contentService, messageService) {
        var _this = this;
        this.partyService = partyService;
        this.objectService = objectService;
        this.contentService = contentService;
        this.messageService = messageService;
        this.onSelectionChanged = new core_1.EventEmitter();
        this.onAddClicked = new core_1.EventEmitter();
        this.inputBeanType = 'party';
        this.inputOnlyEmail = false;
        this.inputSelectedBeanId = null;
        this.inputSelectedPartyEmail = null;
        this.displayInInit = true;
        this.displayPlaceholderMessage = "";
        // private emailRegexp: RegExp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9]))*$/i;
        this.emailRegexp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        this.onChange = function (_) { };
        this.onTouched = function () { };
        this.dataSource = Observable_1.Observable
            .create(function (observer) {
            // Runs on every search
            observer.next(_this.enteredValue);
        })
            .mergeMap(function (token) { return _this.getBeansAsObservable(token); });
    }
    TypeaheadComponent_1 = TypeaheadComponent;
    TypeaheadComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.inputBeanType == 'party') {
            this.partyService.getParties()
                .then(function (beans) {
                _this.beans = beans;
            });
            if (this.inputSelectedBeanId) {
                this.partyService.getParty(this.inputSelectedBeanId)
                    .then(function (p) {
                    _this.changeSelectedBean(p);
                    if (_this.selectedBean) {
                        _this.enteredValue = _this.getBeanDisplayString(_this.selectedBean);
                    }
                    _this.displayInInit = false;
                })
                    .catch(function (e) {
                    _this.displayInInit = false;
                });
            }
            else if (this.inputSelectedPartyEmail) {
                this.partyService.getPartyByEmail(this.inputSelectedPartyEmail)
                    .then(function (p) {
                    _this.changeSelectedBean(p);
                    if (_this.selectedBean) {
                        _this.enteredValue = _this.selectedBean.email;
                    }
                    _this.displayInInit = false;
                })
                    .catch(function (e) {
                    _this.displayInInit = false;
                });
            }
            else {
                this.displayInInit = false;
            }
            this.displayPlaceholderMessage = "Zoeken in uw contacten...";
            if (this.inputOnlyEmail) {
                this.displayPlaceholderMessage = "Email toevoegen of op email zoeken in uw contacten...";
            }
        }
        else if (this.inputBeanType == 'object') {
            this.objectService.getObjects()
                .then(function (beans) {
                _this.beans = beans;
            });
            this.objectService.getObject(this.inputSelectedBeanId)
                .then(function (p) {
                _this.changeSelectedBean(p);
                if (_this.selectedBean) {
                    _this.enteredValue = _this.getBeanDisplayString(_this.selectedBean);
                }
                _this.displayInInit = false;
            })
                .catch(function (e) {
                _this.displayInInit = false;
            });
            this.displayPlaceholderMessage = "Zoeken in uw huizen...";
        }
    };
    TypeaheadComponent.prototype.getBeansAsObservable = function (token) {
        var _this = this;
        return Observable_1.Observable.of(this.beans.filter(function (p) {
            return _this.checkForMatch(token, p, false);
        }));
    };
    TypeaheadComponent.prototype.onTypeaheadLoading = function (e) {
        var _this = this;
        if (this.selectedBean != null && !this.checkForMatch(this.enteredValue, this.selectedBean, true)) {
            this.changeSelectedBean(null);
        }
        else if (this.selectedBean == null) {
            // safe subscription, completes immediately
            this.getBeansAsObservable(this.enteredValue)
                .subscribe(function (ps) {
                if (ps != null && ps.length >= 1) {
                    var p = ps[0];
                    if (_this.checkForMatch(_this.enteredValue, p, true)) {
                        _this.changeSelectedBean(p);
                    }
                }
            });
        }
        this.displayTypeaheadLoading = e;
    };
    TypeaheadComponent.prototype.checkForMatch = function (query, bean, fullMatch) {
        if (query == null || query.length == 0) {
            return false;
        }
        var beanText = this.getBeanDisplayString(bean);
        if (fullMatch) {
            // look for full match
            if (beanText.toLowerCase() == query.toLowerCase()) {
                return true;
            }
        }
        else {
            if (beanText != null && beanText.length > 0) {
                return beanText.toLowerCase().includes(query.toLowerCase());
            }
        }
        return false;
    };
    TypeaheadComponent.prototype.getBeanDisplayString = function (bean) {
        if (this.inputBeanType == 'party' && this.inputOnlyEmail) {
            return bean.email;
        }
        else {
            return bean.getDisplayString();
        }
    };
    TypeaheadComponent.prototype.onTypeaheadNoResults = function (e) {
        this.displayTypeaheadNoResults = e;
    };
    TypeaheadComponent.prototype.onTypeaheadOnSelect = function (e) {
        this.changeSelectedBean(e.item);
    };
    TypeaheadComponent.prototype.changeSelectedBean = function (b) {
        this.selectedBean = b;
        this.onSelectionChanged.emit(this.selectedBean);
        this.onChange(this.selectedBean);
    };
    TypeaheadComponent.prototype.add = function () {
        var _this = this;
        this.onAddClicked.emit(this.enteredValue);
        this.partyService.addNewParty()
            .then(function (p) {
            p.partytype = _this.inputNewPartyType;
            if (_this.isEmail(_this.enteredValue)) {
                p.email = _this.enteredValue;
            }
            else {
                if (_this.inputNewPartyType == 'houseowner') {
                    p.lastname = _this.enteredValue;
                }
                else {
                    p.companyname = _this.enteredValue;
                }
            }
            _this.partyService.updateParty(p)
                .then(function (p) {
                p = party_class_1.Party.parse(p);
                _this.messageService.sendMessage("'" + _this.getBeanDisplayString(p) + "' is toegevoegd aan uw contactenlijst.", "");
                _this.onTypeaheadNoResults(false);
                _this.changeSelectedBean(p);
            });
        });
    };
    TypeaheadComponent.prototype.isEmail = function (s) {
        if (this.emailRegexp.test(s)) {
            return true;
        }
        return false;
    };
    TypeaheadComponent.prototype.displayValidEmail = function () {
        return this.isEmail(this.enteredValue);
    };
    TypeaheadComponent.prototype.displayValidNewContact = function () {
        if (this.inputBeanType == 'party' && !this.selectedBean && !this.inputOnlyEmail && this.enteredValue) {
            return true;
        }
        if (this.inputBeanType == 'party' && !this.selectedBean && this.inputOnlyEmail && this.displayValidEmail()) {
            return true;
        }
        return false;
    };
    TypeaheadComponent.prototype.reset = function () {
        this.enteredValue = null;
        this.changeSelectedBean(null);
        this.inputSelectedPartyEmail = null;
        this.inputSelectedBeanId = null;
        this.ngOnInit();
    };
    TypeaheadComponent.prototype.writeValue = function (value) {
        // not supported
    };
    TypeaheadComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    TypeaheadComponent.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    var TypeaheadComponent_1;
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], TypeaheadComponent.prototype, "onSelectionChanged", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], TypeaheadComponent.prototype, "onAddClicked", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], TypeaheadComponent.prototype, "inputBeanType", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], TypeaheadComponent.prototype, "inputOnlyEmail", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], TypeaheadComponent.prototype, "inputSelectedBeanId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], TypeaheadComponent.prototype, "inputSelectedPartyEmail", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], TypeaheadComponent.prototype, "inputNewPartyType", void 0);
    TypeaheadComponent = TypeaheadComponent_1 = __decorate([
        core_1.Component({
            selector: 'typeahead',
            templateUrl: 'app_html/typeahead.component.html',
            providers: [
                {
                    provide: forms_1.NG_VALUE_ACCESSOR,
                    useExisting: core_1.forwardRef(function () { return TypeaheadComponent_1; }),
                    multi: true
                }
            ]
        }),
        __metadata("design:paramtypes", [party_service_1.PartyService, object_service_1.ObjectService, content_service_1.ContentService, message_service_1.MessageService])
    ], TypeaheadComponent);
    return TypeaheadComponent;
}());
exports.TypeaheadComponent = TypeaheadComponent;
