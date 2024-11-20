"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = exports.ErrorCode = void 0;
exports.errorHandler = errorHandler;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["Unknown"] = 1] = "Unknown";
    ErrorCode[ErrorCode["BadRequest"] = 2] = "BadRequest";
    ErrorCode[ErrorCode["RecordNotFound"] = 3] = "RecordNotFound";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
;
var AppError = /** @class */ (function (_super) {
    __extends(AppError, _super);
    function AppError(code, message, details) {
        var _this = _super.call(this) || this;
        _this.code = code;
        _this.message = message;
        _this.details = details;
        return _this;
    }
    AppError.prototype.toString = function () {
        return "[".concat(this.code.toString(), "], Message ").concat(this.message, ", Details: ").concat(JSON.stringify(this.details));
    };
    return AppError;
}(Error));
exports.AppError = AppError;
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        next(err);
        return;
    }
    console.error("Handled error:", err.toString());
    if (err instanceof AppError) {
        res.status(toHTTPStatus(err.code));
        res.json({
            error: {
                code: err.code,
                message: err.message,
                details: err.details, // eslint-disable-line @typescript-eslint/no-unsafe-assignment -- not unsafe.
            }
        });
        return;
    }
    res.status(500);
    res.json({
        error: {
            code: ErrorCode.Unknown,
            message: "Something went wrong"
        }
    });
}
function toHTTPStatus(errCode) {
    switch (errCode) {
        case ErrorCode.RecordNotFound:
            return 404;
        case ErrorCode.BadRequest:
            return 400;
        default:
            return 500;
    }
}
