"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
;
var Vehicle = /** @class */ (function () {
    function Vehicle(id, shortcode, battery, position) {
        this.id = id;
        this.shortcode = shortcode;
        this.battery = battery;
        this.position = position;
    }
    return Vehicle;
}());
exports.Vehicle = Vehicle;
