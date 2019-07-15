"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Task_1 = require("fp-ts/lib/Task");
var function_1 = require("fp-ts/lib/function");
var remoteDataT = require("../remote-data-t");
var remoteData = require("../remote-data");
describe('RemoteDataT', function () {
    it('chain', function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var chain, of, f, x, y, _a, e1, e2;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    chain = remoteDataT.chain(Task_1.task);
                    of = remoteDataT.getRemoteDataT(Task_1.task).of;
                    f = function (n) { return of(n * 2); };
                    x = of(1);
                    y = remoteDataT.fromRemoteData(Task_1.task)(remoteData.failure('foo'));
                    return [4 /*yield*/, Promise.all([chain(f, x)(), chain(f, y)()])];
                case 1:
                    _a = _b.sent(), e1 = _a[0], e2 = _a[1];
                    expect(e1).toEqual(remoteData.success(2));
                    expect(e2).toEqual(remoteData.failure('foo'));
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('success', function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var success, rdTask, rd;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    success = remoteDataT.success(Task_1.task);
                    rdTask = success(Task_1.task.of(42));
                    return [4 /*yield*/, rdTask()];
                case 1:
                    rd = _a.sent();
                    rd.foldL(fail, fail, fail, function (n) { return expect(n).toEqual(42); });
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('failure', function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var failure, rdTask, rd;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    failure = remoteDataT.failure(Task_1.task);
                    rdTask = failure(Task_1.task.of(new Error('oops')));
                    return [4 /*yield*/, rdTask()];
                case 1:
                    rd = _a.sent();
                    rd.foldL(fail, fail, function (e) { return expect(e.message).toEqual('oops'); }, fail);
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('fromRemoteData', function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var fromRemoteData, rdTask, rd;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fromRemoteData = remoteDataT.fromRemoteData(Task_1.task);
                    rdTask = fromRemoteData(remoteData.success(42));
                    return [4 /*yield*/, rdTask()];
                case 1:
                    rd = _a.sent();
                    rd.foldL(fail, fail, fail, function (n) { return expect(n).toEqual(42); });
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('fold', function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var fold, rdTaskInitial, rdTaskPending, rdTaskFailure, rdTaskSuccess, _a, i, p, f, s;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fold = remoteDataT.fold(Task_1.task);
                    rdTaskInitial = fold('initial', 'pending', function (e) { return e.message; }, function_1.identity, Task_1.task.of(remoteData.initial));
                    rdTaskPending = fold('initial', 'pending', function (e) { return e.message; }, function_1.identity, Task_1.task.of(remoteData.pending));
                    rdTaskFailure = fold('initial', 'pending', function (e) { return e.message; }, function_1.identity, Task_1.task.of(remoteData.failure(new Error('failure'))));
                    rdTaskSuccess = fold('initial', 'pending', function (e) { return e.message; }, function_1.identity, Task_1.task.of(remoteData.success('success')));
                    return [4 /*yield*/, Promise.all([rdTaskInitial(), rdTaskPending(), rdTaskFailure(), rdTaskSuccess()])];
                case 1:
                    _a = _b.sent(), i = _a[0], p = _a[1], f = _a[2], s = _a[3];
                    expect(i).toEqual('initial');
                    expect(p).toEqual('pending');
                    expect(f).toEqual('failure');
                    expect(s).toEqual('success');
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('foldL', function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var foldL, rdTaskInitial, rdTaskPending, rdTaskFailure, rdTaskSuccess, _a, i, p, f, s;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    foldL = remoteDataT.foldL(Task_1.task);
                    rdTaskInitial = foldL(function_1.constant('initial'), function_1.constant('pending'), function (e) { return e.message; }, function_1.identity, Task_1.task.of(remoteData.initial));
                    rdTaskPending = foldL(function_1.constant('initial'), function_1.constant('pending'), function (e) { return e.message; }, function_1.identity, Task_1.task.of(remoteData.pending));
                    rdTaskFailure = foldL(function_1.constant('initial'), function_1.constant('pending'), function (e) { return e.message; }, function_1.identity, Task_1.task.of(remoteData.failure(new Error('failure'))));
                    rdTaskSuccess = foldL(function_1.constant('initial'), function_1.constant('pending'), function (e) { return e.message; }, function_1.identity, Task_1.task.of(remoteData.success('success')));
                    return [4 /*yield*/, Promise.all([rdTaskInitial(), rdTaskPending(), rdTaskFailure(), rdTaskSuccess()])];
                case 1:
                    _a = _b.sent(), i = _a[0], p = _a[1], f = _a[2], s = _a[3];
                    expect(i).toEqual('initial');
                    expect(p).toEqual('pending');
                    expect(f).toEqual('failure');
                    expect(s).toEqual('success');
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('getRemoteDataT', function () {
        var getRemoteDataT = remoteDataT.getRemoteDataT(Task_1.task);
        expect(getRemoteDataT.ap).toBeDefined();
        expect(getRemoteDataT.of).toBeDefined();
        expect(getRemoteDataT.map).toBeDefined();
        expect(getRemoteDataT.chain).toBeDefined();
    });
});
