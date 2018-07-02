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
// import { AgmMap } from '@agm/core';
var GooglemapComponent = /** @class */ (function () {
    function GooglemapComponent() {
        this.lat = 51.678418;
        this.lon = 7.809007;
    }
    // @ViewChild('googleMap')
    // gmap: AgmMap;
    GooglemapComponent.prototype.ngOnInit = function () {
        this.update(this.lat, this.lon);
    };
    GooglemapComponent.prototype.update = function (lat, lon) {
        this.lat = parseFloat("" + this.lat);
        this.lon = parseFloat("" + this.lon);
        // this.gmap.triggerResize();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], GooglemapComponent.prototype, "lat", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], GooglemapComponent.prototype, "lon", void 0);
    GooglemapComponent = __decorate([
        core_1.Component({
            selector: 'googlemap',
            templateUrl: 'app_html/googlemap.component.html',
            styleUrls: ['app_html/googlemap.component.css']
        })
    ], GooglemapComponent);
    return GooglemapComponent;
}());
exports.GooglemapComponent = GooglemapComponent;
