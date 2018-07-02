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
var ngx_bootstrap_1 = require("ngx-bootstrap");
var image_service_1 = require("./image.service");
var message_service_1 = require("./message.service");
var ImagesComponent = /** @class */ (function () {
    // @ViewChild('modalPdfViewer') modalPdfViewer: PdfViewerComponent;
    // @ViewChild('modalImageViewer') modalImageViewer: any;
    function ImagesComponent(imageService, route, messageService) {
        this.imageService = imageService;
        this.route = route;
        this.messageService = messageService;
        this.read_only = false;
        this.show_info = true;
        this.show_download = true;
        this.show_rotate = true;
        this.show_delete = true;
        this.onImagesChanged = new core_1.EventEmitter();
        // modalImageCSSTransform: string;
        this.uploading = false;
        this.filesToUpload = [];
        this.images = [];
    }
    ImagesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.imageService.getImages(this.reference_table, this.reference_id, this.reference_string)
            .then(function (images) {
            _this.images = images;
        });
    };
    ImagesComponent.prototype.onClick = function (image) {
        if (this.imageService.getImageInternalType(image) != "") {
            this.modalImage = image;
            this.modalViewer = this.imageService.getImageInternalType(image);
            this.modalImageUrl = this.imageService.getImageUrl(image, false);
            // this.modalImageCSSTransform = 'rotate(' + image.rotation + 'deg)';
            this.modalImageTitle = image.name;
            this.modalWindow.show();
        }
        else {
            this.modalImage = null;
            this.modalViewer = '';
            this.modalImageUrl = '';
            this.modalImageTitle = 'Preview van dit bestand is niet mogelijk: ' + image.name + ' [' + image.file_type + ']';
            this.modalWindow.show();
        }
    };
    ImagesComponent.prototype.onDelete = function (image) {
        var _this = this;
        if (this.read_only) {
            return;
        }
        this.imageService.deleteImage(image)
            .then(function (result) {
            _this.images = _this.images.filter(function (h) { return h !== image; });
            _this.messageService.sendNotification('Document ' + image.name + ' verwijderd.', '');
            _this.onImagesChanged.emit(null);
        })
            .catch(function (error) {
            _this.messageService.sendMessage('Fout bij verwijderen document.', error);
        });
    };
    ImagesComponent.prototype.onDownload = function (image) {
    };
    ImagesComponent.prototype.onShowModal = function (event) {
    };
    ImagesComponent.prototype.onHideModal = function (event) {
        this.modalImage = null;
        this.modalViewer = '';
        this.modalImageUrl = '';
    };
    ImagesComponent.prototype.fileChangeEvent = function (fileInput) {
        var _this = this;
        if (this.read_only) {
            return;
        }
        this.uploading = true;
        this.filesToUpload = fileInput.target.files;
        this.imageService.getBucketUploadHandler()
            .then(function (upload_url) {
            _this.makeFileRequest(upload_url, [], _this.filesToUpload)
                .then(function (result) {
                _this.uploading = false;
                _this.ngOnInit();
                _this.onImagesChanged.emit(null);
            })
                .catch(function (error) {
                _this.uploading = false;
                _this.messageService.sendMessage('Fout bij uploaden document.', error);
            });
        })
            .catch(function (error) {
            _this.uploading = false;
        });
    };
    ImagesComponent.prototype.makeFileRequest = function (url, params, files) {
        var _this = this;
        if (this.read_only) {
            return;
        }
        return new Promise(function (resolve, reject) {
            var formData = new FormData();
            var xhr = new XMLHttpRequest();
            for (var i = 0; i < files.length; i++) {
                formData.append("uploads[]", files[i], files[i].name);
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    }
                    else {
                        reject(xhr.response);
                    }
                }
            };
            xhr.open("POST", url, true);
            formData.append("reference_table", _this.reference_table);
            formData.append("reference_id", _this.reference_id);
            formData.append("reference_string", _this.reference_string);
            xhr.send(formData);
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ImagesComponent.prototype, "reference_table", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], ImagesComponent.prototype, "reference_id", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ImagesComponent.prototype, "reference_string", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ImagesComponent.prototype, "css_class", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ImagesComponent.prototype, "read_only", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ImagesComponent.prototype, "show_info", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ImagesComponent.prototype, "show_download", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ImagesComponent.prototype, "show_rotate", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ImagesComponent.prototype, "show_delete", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ImagesComponent.prototype, "onImagesChanged", void 0);
    __decorate([
        core_1.ViewChild('modalWindow'),
        __metadata("design:type", ngx_bootstrap_1.ModalDirective)
    ], ImagesComponent.prototype, "modalWindow", void 0);
    ImagesComponent = __decorate([
        core_1.Component({
            selector: 'images',
            templateUrl: 'app_html/images.component.html',
            styleUrls: ['app_html/images.component.css']
        }),
        __metadata("design:paramtypes", [image_service_1.ImageService, router_1.ActivatedRoute, message_service_1.MessageService])
    ], ImagesComponent);
    return ImagesComponent;
}());
exports.ImagesComponent = ImagesComponent;
