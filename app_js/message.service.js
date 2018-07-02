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
var message_class_1 = require("./message.class");
var MessageService = /** @class */ (function () {
    function MessageService() {
        this.messages = new Array();
    }
    MessageService.prototype.sendMessage = function (message, moreInfo) {
        var m = new message_class_1.Message();
        m.type = "warning";
        m.closable = true;
        m.message = message;
        m.moreInfo = moreInfo;
        m.dismissTimeout = 5000;
        this.messages.push(m);
        console.log(m.message);
        console.log(m.moreInfo);
    };
    MessageService.prototype.sendNotification = function (message, moreInfo) {
        var m = new message_class_1.Message();
        m.type = "info";
        m.closable = true;
        m.message = message;
        m.moreInfo = moreInfo;
        m.dismissTimeout = 0;
        this.messages.push(m);
        console.log(m.moreInfo);
    };
    MessageService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], MessageService);
    return MessageService;
}());
exports.MessageService = MessageService;
