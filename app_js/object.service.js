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
var objectbean_class_1 = require("./objectbean.class");
var bean_service_1 = require("./bean.service");
var message_service_1 = require("./message.service");
var ObjectService = /** @class */ (function (_super) {
    __extends(ObjectService, _super);
    function ObjectService(http, messageService) {
        var _this = _super.call(this, http, messageService) || this;
        _this.http = http;
        _this.messageService = messageService;
        _this.apiName = 'object';
        _this.objects = null;
        _this.selectedObjects = new Array();
        _this.getDefaultHouseparts();
        return _this;
    }
    ObjectService.prototype.getApiName = function () {
        return this.apiName;
    };
    ObjectService.prototype.getObjects = function () {
        var _this = this;
        if (this.objects == null) {
            return this.http.get(this.getApiUrl())
                .toPromise()
                .then(function (response) {
                var b = response.json().data;
                _this.objects = new Array();
                b.forEach(function (o) {
                    _this.objects.push(objectbean_class_1.ObjectBean.parse(o));
                });
                return _this.objects;
            })
                .catch(function (error) { return _this.handleError(error); });
        }
        else {
            return Promise.resolve(this.objects);
        }
    };
    ObjectService.prototype.getSelectedObjects = function () {
        return Promise.resolve(this.selectedObjects);
    };
    ObjectService.prototype.getObject = function (id) {
        return this.getObjects()
            .then(function (objects) {
            return objects.find(function (object) {
                return object.id == id;
            });
        });
    };
    ObjectService.prototype.addNewObject = function () {
        var _this = this;
        var o = new objectbean_class_1.ObjectBean();
        // return this.addNewBean(o)
        // 	.then(object => {
        // 		this.objects.push(object);
        // 		return object;
        // 	});
        return this.http
            .post(this.getApiUrl(), JSON.stringify(o), this.options)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .then(function (object) {
            _this.objects.push(objectbean_class_1.ObjectBean.parse(object));
            return object;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    ObjectService.prototype.updateObject = function (object) {
        var _this = this;
        var url = this.getApiUrl() + "/" + object.id;
        return this.http
            .post(url, JSON.stringify(object), this.options)
            .toPromise()
            .then(function (response) {
            var o = response.json().data;
            return _this.getObjects()
                .then(function (objects) {
                var index = objects.findIndex(function (object) {
                    return object.id == o.id;
                });
                _this.objects[index] = objectbean_class_1.ObjectBean.parse(o);
                return o;
            });
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    ObjectService.prototype.deleteObject = function (objectToDelete) {
        // return this.deleteBean(objectToDelete).then(object => {
        // 	this.objects = this.objects.filter(o => o.id !== objectToDelete.id);
        // 	this.selectedObjects = this.selectedObjects.filter(o => o.id !== objectToDelete.id);
        // 	return object;
        // });
        var _this = this;
        return this.http
            .delete(this.getApiUrl() + '/' + objectToDelete.id)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .then(function (object) {
            _this.objects = _this.objects.filter(function (o) { return o.id !== objectToDelete.id; });
            _this.selectedObjects = _this.selectedObjects.filter(function (o) { return o.id !== objectToDelete.id; });
            return object;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    ObjectService.prototype.toggleObjectSelection = function (o) {
        var temp;
        temp = this.selectedObjects.find(function (object) { return object.id === o.id; });
        if (temp === undefined) {
            this.selectedObjects.push(o);
        }
        else {
            var index = this.selectedObjects.indexOf(temp, 0);
            if (index > -1) {
                this.selectedObjects.splice(index, 1);
            }
        }
    };
    ObjectService.prototype.isObjectSelected = function (o) {
        var temp;
        temp = this.selectedObjects.find(function (object) { return object.id === o.id; });
        if (temp === undefined) {
            return false;
        }
        return true;
    };
    ObjectService.prototype.getDefaultHouseparts = function () {
        var _this = this;
        if (this.defaultHouseparts) {
            return Promise.resolve(this.defaultHouseparts);
        }
        else {
            return this.http.get(this.getApiUrl() + '/defaulthouseparts')
                .toPromise()
                .then(function (response) {
                _this.defaultHouseparts = response.json().data;
                return _this.defaultHouseparts;
            })
                .catch(function (error) { return _this.handleError(error); });
        }
    };
    ObjectService.prototype.getHousepartName = function (id) {
        var hp;
        hp = this.defaultHouseparts.find(function (hp) { return hp.id == id; });
        if (hp == undefined) {
            return '';
        }
        return hp.text;
    };
    ObjectService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, message_service_1.MessageService])
    ], ObjectService);
    return ObjectService;
}(bean_service_1.BeanService));
exports.ObjectService = ObjectService;
