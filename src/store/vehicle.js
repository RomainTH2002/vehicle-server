"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleStore = void 0;
var vehicle_1 = require("../model/vehicle");
var errors_1 = require("../errors");
var findStatement = "\nSELECT id, shortcode, battery, ST_X(position) as long, ST_Y(position) as lat\nFROM vehicle_server.vehicles\nORDER BY position <-> ST_MakePoint($1, $2)::geography ASC\nLIMIT $3;\n";
var createStatement = "\nINSERT INTO vehicle_server.vehicles (shortcode, battery, position)\nVALUES ($1, $2, ST_MakePoint($3, $4))\nRETURNING id, shortcode, battery, ST_X(position) as long, ST_Y(position) as lat;\n";
var deleteStatement = "\nDELETE FROM vehicle_server.vehicles WHERE id = $1;\n";
var VehicleStore = /** @class */ (function () {
    function VehicleStore(db) {
        this.db = db;
    }
    VehicleStore.prototype.createVehicle = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var result, vehicleRow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.query(createStatement, [req.shortcode, req.battery, req.position.longitude, req.position.latitude])];
                    case 1:
                        result = _a.sent();
                        if (result.rows.length > 1) {
                            throw new Error("unexpected amount of rows returned");
                        }
                        vehicleRow = result.rows[0];
                        return [2 /*return*/, newVehicleFromRow(vehicleRow)];
                }
            });
        });
    };
    VehicleStore.prototype.deleteVehicle = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.query(deleteStatement, [req.id])];
                    case 1:
                        result = _a.sent();
                        if (result.rowCount == 0) {
                            throw new errors_1.AppError(errors_1.ErrorCode.RecordNotFound, "Vehicle not found for deletion", { id: req.id });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    VehicleStore.prototype.findVehicles = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.query(findStatement, [req.location.longitude, req.location.latitude, req.limit])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows.map(function (r) {
                                return newVehicleFromRow(r);
                            })];
                }
            });
        });
    };
    return VehicleStore;
}());
exports.VehicleStore = VehicleStore;
function newVehicleFromRow(vehicleRow) {
    return new vehicle_1.Vehicle(vehicleRow.id, vehicleRow.shortcode, vehicleRow.battery, {
        longitude: vehicleRow.lat,
        latitude: vehicleRow.long
    });
}
