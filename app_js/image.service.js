"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
var bean_service_1 = require("./bean.service");
var message_service_1 = require("./message.service");
var ImageService = /** @class */ (function (_super) {
    __extends(ImageService, _super);
    function ImageService(http, messageService) {
        var _this = _super.call(this, http, messageService) || this;
        _this.http = http;
        _this.messageService = messageService;
        _this.apiName = 'image';
        return _this;
    }
    ImageService.prototype.getApiName = function () {
        return this.apiName;
    };
    ImageService.prototype.getImages = function (reference_table, reference_id, reference_string) {
        var _this = this;
        return this.http.get(this.getApiUrl() + '/' + reference_table + '/' + reference_id + '/' + reference_string)
            .toPromise()
            .then(function (response) {
            return response.json().data;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    ImageService.prototype.getBucketUploadHandler = function () {
        var _this = this;
        return this.http.get(this.getApiUrl() + '/bucket_session')
            .toPromise()
            .then(function (response) {
            return response.json().data;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    ImageService.prototype.deleteImage = function (image) {
        return this.deleteBean(image);
    };
    ImageService.prototype.updateImage = function (image) {
        return this.updateBean(image);
    };
    ImageService.prototype.getImageUrl = function (image, isDownload) {
        if (isDownload) {
            return '/api/image/download/' + image.id;
        }
        else {
            return '/api/image/embed/' + image.id;
        }
    };
    ImageService.prototype.getImageThumbnailUrl = function (image) {
        if (this.getImageInternalType(image) == 'image') {
            // return image.baseurl;
            return this.getImageUrl(image, false);
        }
        else if (image.file_type_mime_icon != null) {
            return '/images/mime/' + image.file_type_mime_icon;
        }
        else {
            return '/images/mime/application_vnd.png';
        }
    };
    ImageService.prototype.getImageInternalType = function (image) {
        if (image.file_type != null && image.file_type.startsWith('image')) {
            return 'image';
        }
        else if (image.file_type != null && image.file_type == 'application/pdf') {
            return 'pdf';
        }
        else {
            return "";
        }
    };
    ImageService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, message_service_1.MessageService])
    ], ImageService);
    return ImageService;
}(bean_service_1.BeanService));
exports.ImageService = ImageService;
