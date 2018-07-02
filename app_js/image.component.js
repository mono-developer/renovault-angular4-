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
var animations_1 = require("@angular/animations");
var router_1 = require("@angular/router");
var image_service_1 = require("./image.service");
var image_class_1 = require("./image.class");
var message_service_1 = require("./message.service");
var ImageComponent = /** @class */ (function () {
    function ImageComponent(imageService, route, messageService) {
        this.imageService = imageService;
        this.route = route;
        this.messageService = messageService;
        this.read_only = false;
        this.show_info = true;
        this.show_download = true;
        this.show_rotate = true;
        this.show_delete = true;
        this.onClick = new core_1.EventEmitter();
        this.onDelete = new core_1.EventEmitter();
        this.onDownload = new core_1.EventEmitter();
        this.onRotate = new core_1.EventEmitter();
        this.rotatedState = '0';
    }
    ImageComponent.prototype.ngOnInit = function () {
        if (this.image.rotation) {
            this.rotatedState = '' + this.image.rotation;
        }
    };
    ImageComponent.prototype.onClickHandler = function (image) {
        this.onClick.emit(null);
    };
    ImageComponent.prototype.onDeleteHandler = function (image) {
        this.onDelete.emit(null);
    };
    ImageComponent.prototype.onDownloadHandler = function (image) {
        this.onDownload.emit(null);
    };
    ImageComponent.prototype.onRotateHandler = function (image) {
        var rotatedDegrees = Number.parseInt(this.rotatedState);
        rotatedDegrees += 90;
        rotatedDegrees = rotatedDegrees % 360;
        this.rotatedState = '' + rotatedDegrees;
        this.image.rotation = this.rotatedState;
        this.imageService.updateImage(this.image);
        this.onRotate.emit(null);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ImageComponent.prototype, "read_only", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ImageComponent.prototype, "show_info", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ImageComponent.prototype, "show_download", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ImageComponent.prototype, "show_rotate", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ImageComponent.prototype, "show_delete", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ImageComponent.prototype, "onClick", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ImageComponent.prototype, "onDelete", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ImageComponent.prototype, "onDownload", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ImageComponent.prototype, "onRotate", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", image_class_1.Image)
    ], ImageComponent.prototype, "image", void 0);
    ImageComponent = __decorate([
        core_1.Component({
            selector: 'image',
            templateUrl: 'app_html/image.component.html',
            styleUrls: ['app_html/image.component.css'],
            animations: [
                // Each unique animation requires its own trigger. The first argument of the trigger function is the name
                animations_1.trigger('rotatedState', [
                    animations_1.state('0', animations_1.style({ transform: 'rotate(0)' })),
                    animations_1.state('90', animations_1.style({ transform: 'rotate(90deg)' })),
                    animations_1.state('180', animations_1.style({ transform: 'rotate(180deg)' })),
                    animations_1.state('270', animations_1.style({ transform: 'rotate(270deg)' })),
                    animations_1.transition('0 => 90', animations_1.animate('400ms ease-in')),
                    animations_1.transition('90 => 180', animations_1.animate('400ms ease-in')),
                    animations_1.transition('180 => 270', animations_1.animate('400ms ease-in')),
                    animations_1.transition('270 => 0', animations_1.animate('400ms ease-in'))
                ])
            ]
        }),
        __metadata("design:paramtypes", [image_service_1.ImageService, router_1.ActivatedRoute, message_service_1.MessageService])
    ], ImageComponent);
    return ImageComponent;
}());
exports.ImageComponent = ImageComponent;
