"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var mobx_1 = require("mobx");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/do");
require("rxjs/add/operator/switchMap");
var lodash_1 = require("lodash");
var Deferred_1 = require("./internal/Deferred");
function createForm(fields) {
    var formMetadata = mobx_1.observable({
        isDirty: false,
        isPristine: true,
        isSubmitting: false,
        isValidating: false,
        isValid: false,
    });
    var formFields = mobx_1.observable(fields);
    var validation = {
        deferred: null,
        subscription: null,
    };
    var form = __assign({ get isDirty() { return formMetadata.isDirty; },
        get isPristine() { return formMetadata.isPristine; },
        get isSubmitting() { return formMetadata.isSubmitting; },
        get isValidating() { return formMetadata.isValidating; },
        get isValid() { return formMetadata.isValid; },
        dispose: function () {
            if (validation.subscription != null) {
                validation.subscription.unsubscribe();
                validation.subscription = null;
            }
        },
        update: function () {
            lodash_1.forEach(formFields, function (value) {
                value.update(form);
            });
        },
        submit: function (onSubmit) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!formMetadata.isSubmitting) return [3 /*break*/, 1];
                            return [2 /*return*/, Promise.reject('submitting')];
                        case 1:
                            if (!!formMetadata.isValid) return [3 /*break*/, 2];
                            return [2 /*return*/, Promise.reject('invalid')];
                        case 2:
                            formMetadata.isSubmitting = true;
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, , 5, 6]);
                            return [4 /*yield*/, onSubmit(form)];
                        case 4: return [2 /*return*/, _a.sent()];
                        case 5:
                            mobx_1.runInAction(function () {
                                formMetadata.isSubmitting = false;
                            });
                            return [7 /*endfinally*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        },
        validateForm: function () {
            if (validation.deferred == null) {
                validation.deferred = new Deferred_1.Deferred();
            }
            sub.next();
            return validation.deferred.promise;
        } }, formFields);
    mobx_1.reaction(function () { return lodash_1.map(formFields, function (it) {
        return {
            value: it.value,
            isTouched: it.isTouched
        };
    }); }, function () {
        form.validateForm();
        form.update();
    }, {
        fireImmediately: true
    });
    var sub = new Subject_1.Subject();
    validation.subscription = sub.asObservable()
        .do(mobx_1.action(function () { return formMetadata.isValidating = true; }))
        .switchMap(function () {
        return Promise.all(lodash_1.map(formFields, function (it) { return it.validate(form); }))
            .then(mobx_1.action(function (results) {
            var result = lodash_1.every(results);
            formMetadata.isValid = result;
            return true;
        }), function (reason) {
            console.error(reason);
            return false;
        });
    })
        .subscribe(function (result) {
        validation.deferred.resolve(result);
        validation.deferred = null;
    });
    return form;
}
exports.createForm = createForm;
exports.createFormCreator = function (fields) { return function () { return createForm(fields); }; };
//# sourceMappingURL=createForm.js.map