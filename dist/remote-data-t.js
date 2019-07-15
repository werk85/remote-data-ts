"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var RD = require("./remote-data");
var remote_data_1 = require("./remote-data");
var Applicative_1 = require("fp-ts/lib/Applicative");
function chain(F) {
    return function (f, fa) {
        return F.chain(fa, function (e) {
            switch (e._tag) {
                case 'RemoteInitial':
                    return F.of(RD.initial);
                case 'RemotePending':
                    return F.of(RD.pending);
                case 'RemoteFailure':
                    return F.of(RD.failure(e.error));
                case 'RemoteSuccess':
                    return f(e.value);
            }
        });
    };
}
exports.chain = chain;
function success(F) {
    return function (ma) { return F.map(ma, function (a) { return RD.success(a); }); };
}
exports.success = success;
function failure(F) {
    return function (ml) { return F.map(ml, function (l) { return RD.failure(l); }); };
}
exports.failure = failure;
function fromRemoteData(F) {
    return function (oa) { return F.of(oa); };
}
exports.fromRemoteData = fromRemoteData;
function fold(F) {
    return function (initial, pending, failure, success, fa) {
        return F.map(fa, function (e) {
            switch (e._tag) {
                case 'RemoteInitial':
                    return initial;
                case 'RemotePending':
                    return pending;
                case 'RemoteFailure':
                    return failure(e.error);
                case 'RemoteSuccess':
                    return success(e.value);
            }
        });
    };
}
exports.fold = fold;
function foldL(F) {
    return function (initial, pending, failure, success, fa) {
        return F.map(fa, function (e) {
            switch (e._tag) {
                case 'RemoteInitial':
                    return initial();
                case 'RemotePending':
                    return pending();
                case 'RemoteFailure':
                    return failure(e.error);
                case 'RemoteSuccess':
                    return success(e.value);
            }
        });
    };
}
exports.foldL = foldL;
function getRemoteDataT(M) {
    var A = Applicative_1.getApplicativeComposition(M, remote_data_1.remoteData);
    return tslib_1.__assign({}, A, { chain: chain(M) });
}
exports.getRemoteDataT = getRemoteDataT;
