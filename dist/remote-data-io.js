"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var t = require("io-ts");
var Option_1 = require("fp-ts/lib/Option");
var Either_1 = require("fp-ts/lib/Either");
var pipeable_1 = require("fp-ts/lib/pipeable");
var remote_data_1 = require("./remote-data");
var optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
var RemoteDataFromJSONType = /** @class */ (function (_super) {
    tslib_1.__extends(RemoteDataFromJSONType, _super);
    function RemoteDataFromJSONType(name, is, validate, serialize, left, right) {
        var _this = _super.call(this, name, is, validate, serialize) || this;
        _this.left = left;
        _this.right = right;
        _this._tag = 'RemoteDataFromJSONType';
        return _this;
    }
    return RemoteDataFromJSONType;
}(t.Type));
exports.RemoteDataFromJSONType = RemoteDataFromJSONType;
function createRemoteDataFromJSON(leftType, rightType, name) {
    if (name === void 0) { name = "RemoteData<" + leftType.name + ", " + rightType.name + ">"; }
    var JSONProgress = optionFromNullable_1.optionFromNullable(t.type({
        loaded: t.number,
        total: optionFromNullable_1.optionFromNullable(t.number),
    }));
    var JSONFailure = t.type({
        type: t.literal('Failure'),
        error: leftType,
    });
    var JSONInitial = t.type({
        type: t.literal('Initial'),
    });
    var JSONPending = t.type({
        type: t.literal('Pending'),
        progress: JSONProgress,
    });
    var JSONSuccess = t.type({
        type: t.literal('Success'),
        value: rightType,
    });
    var JSONRemoteData = t.taggedUnion('type', [JSONFailure, JSONInitial, JSONPending, JSONSuccess]);
    return new RemoteDataFromJSONType(name, function (m) {
        return m instanceof remote_data_1.RemoteInitial ||
            m instanceof remote_data_1.RemotePending ||
            (m instanceof remote_data_1.RemoteFailure && leftType.is(m.error)) ||
            (m instanceof remote_data_1.RemoteSuccess && rightType.is(m.value));
    }, function (m, c) {
        var validation = JSONRemoteData.validate(m, c);
        if (Either_1.isLeft(validation)) {
            return validation;
        }
        else {
            var e = validation.right;
            switch (e.type) {
                case 'Failure':
                    return t.success(remote_data_1.failure(e.error));
                case 'Initial':
                    return t.success(remote_data_1.initial);
                case 'Pending':
                    return pipeable_1.pipe(e.progress, Option_1.fold(function () { return t.success(remote_data_1.pending); }, function (p) { return t.success(remote_data_1.progress(p)); }));
                case 'Success':
                    return t.success(remote_data_1.success(e.value));
            }
        }
    }, function (a) {
        return a.foldL(function () { return ({ type: 'Initial' }); }, function (progress) { return ({ type: 'Pending', progress: JSONProgress.encode(progress) }); }, function (l) { return ({ type: 'Failure', error: leftType.encode(l) }); }, function (a) { return ({ type: 'Success', value: rightType.encode(a) }); });
    }, leftType, rightType);
}
exports.createRemoteDataFromJSON = createRemoteDataFromJSON;
