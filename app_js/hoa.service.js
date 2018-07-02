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
var hoa_class_1 = require("./hoa.class");
var bean_service_1 = require("./bean.service");
var message_service_1 = require("./message.service");
var hoamember_class_1 = require("./hoamember.class");
var HoaService = /** @class */ (function (_super) {
    __extends(HoaService, _super);
    function HoaService(http, messageService) {
        var _this = _super.call(this, http, messageService) || this;
        _this.http = http;
        _this.messageService = messageService;
        _this.apiName = 'hoa';
        _this.hoas = null;
        _this.selectedHoas = new Array();
        _this.getDefaultHouseparts();
        return _this;
    }
    HoaService.prototype.getApiName = function () {
        return this.apiName;
    };
    HoaService.prototype.getHoas = function () {
        var _this = this;
        if (this.hoas == null) {
            return this.http.get(this.getApiUrl())
                .toPromise()
                .then(function (response) {
                var b = response.json().data;
                _this.hoas = new Array();
                b.forEach(function (o) {
                    _this.hoas.push(hoa_class_1.Hoa.parse(o));
                });
                return _this.hoas;
            })
                .catch(function (error) { return _this.handleError(error); });
        }
        else {
            return Promise.resolve(this.hoas);
        }
    };
    HoaService.prototype.getSelectedHoas = function () {
        return Promise.resolve(this.selectedHoas);
    };
    HoaService.prototype.getHoa = function (id) {
        return this.getHoas()
            .then(function (hoas) {
            return hoas.find(function (hoa) {
                return hoa.id == id;
            });
        });
    };
    HoaService.prototype.addNewHoa = function () {
        var _this = this;
        var o = new hoa_class_1.Hoa();
        // return this.addNewBean(o)
        // 	.then(hoa => {
        // 		this.hoas.push(hoa);
        // 		return hoa;
        // 	});
        return this.http
            .post(this.getApiUrl(), JSON.stringify(o), this.options)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .then(function (hoa) {
            _this.hoas.push(hoa_class_1.Hoa.parse(hoa));
            return hoa;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    HoaService.prototype.updateHoa = function (hoa) {
        var _this = this;
        var url = this.getApiUrl() + "/" + hoa.id;
        return this.http
            .post(url, JSON.stringify(hoa), this.options)
            .toPromise()
            .then(function (response) {
            var o = response.json().data;
            return _this.getHoas()
                .then(function (hoas) {
                var index = hoas.findIndex(function (hoa) {
                    return hoa.id == o.id;
                });
                _this.hoas[index] = hoa_class_1.Hoa.parse(o);
                return o;
            });
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    HoaService.prototype.deleteHoa = function (hoaToDelete) {
        // return this.deleteBean(hoaToDelete).then(hoa => {
        // 	this.hoas = this.hoas.filter(o => o.id !== hoaToDelete.id);
        // 	this.selectedhoas = this.selectedhoas.filter(o => o.id !== hoaToDelete.id);
        // 	return hoa;
        // });
        var _this = this;
        return this.http
            .delete(this.getApiUrl() + '/' + hoaToDelete.id)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .then(function (hoa) {
            _this.hoas = _this.hoas.filter(function (o) { return o.id !== hoaToDelete.id; });
            _this.selectedHoas = _this.selectedHoas.filter(function (o) { return o.id !== hoaToDelete.id; });
            return hoa;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    HoaService.prototype.toggleHoaSelection = function (o) {
        var temp;
        temp = this.selectedHoas.find(function (hoa) { return hoa.id === o.id; });
        if (temp === undefined) {
            this.selectedHoas.push(o);
        }
        else {
            var index = this.selectedHoas.indexOf(temp, 0);
            if (index > -1) {
                this.selectedHoas.splice(index, 1);
            }
        }
    };
    HoaService.prototype.isHoaSelected = function (o) {
        var temp;
        temp = this.selectedHoas.find(function (hoa) { return hoa.id === o.id; });
        if (temp === undefined) {
            return false;
        }
        return true;
    };
    HoaService.prototype.getDefaultHouseparts = function () {
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
    HoaService.prototype.getHousepartName = function (id) {
        var hp;
        hp = this.defaultHouseparts.find(function (hp) { return hp.id == id; });
        if (hp == undefined) {
            return '';
        }
        return hp.text;
    };
    HoaService.prototype.getHoaMembers = function (hoa) {
        var _this = this;
        var url = this.getApiUrl() + "/member/" + hoa.id;
        return this.http.get(url)
            .toPromise()
            .then(function (response) {
            var b = response.json().data;
            var hoaMembers = new Array();
            b.forEach(function (m) {
                hoaMembers.push(hoamember_class_1.HoaMember.parse(m));
            });
            return hoaMembers;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    HoaService.prototype.addHoaMember = function (hoa, hoaMember) {
        var _this = this;
        var url = this.getApiUrl() + "/member/" + hoa.id;
        return this.http
            .post(url, JSON.stringify(hoaMember), this.options)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .then(function (hoa) {
            _this.hoas.push(hoa_class_1.Hoa.parse(hoa));
            return hoa;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    HoaService.prototype.updateHoaMember = function (hoa, hoaMember) {
        var _this = this;
        var url = this.getApiUrl() + "/member/" + hoa.id + "/" + hoaMember.id;
        return this.http
            .post(url, JSON.stringify(hoaMember), this.options)
            .toPromise()
            .then(function (response) {
            var o = response.json().data;
            return _this.getHoas()
                .then(function (hoas) {
                var index = hoas.findIndex(function (hoa) {
                    return hoa.id == o.id;
                });
                _this.hoas[index] = hoa_class_1.Hoa.parse(o);
                return o;
            });
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    HoaService.prototype.deleteHoaMember = function (hoa, hoaMemberToDelete) {
        var _this = this;
        return this.http
            .delete(this.getApiUrl() + '/member/' + hoa.id + '/' + hoaMemberToDelete.id)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .then(function (hoa) {
            _this.hoas = _this.hoas.filter(function (o) { return o.id !== hoaMemberToDelete.id; });
            _this.selectedHoas = _this.selectedHoas.filter(function (o) { return o.id !== hoaMemberToDelete.id; });
            return hoa;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    HoaService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, message_service_1.MessageService])
    ], HoaService);
    return HoaService;
}(bean_service_1.BeanService));
exports.HoaService = HoaService;
