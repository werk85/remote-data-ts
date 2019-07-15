"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var remote_data_io_1 = require("../remote-data-io");
var t = require("io-ts");
var remote_data_1 = require("../remote-data");
var Either_1 = require("fp-ts/lib/Either");
var Option_1 = require("fp-ts/lib/Option");
describe('RemoteDataFromJSONType', function () {
    it('createRemoteDataFromJSON', function () {
        var T = remote_data_io_1.createRemoteDataFromJSON(t.string, t.number);
        expect(T.decode({ type: 'Failure', error: 'error' })).toEqual(Either_1.right(remote_data_1.failure('error')));
        expect(T.decode({ type: 'Initial' })).toEqual(Either_1.right(remote_data_1.initial));
        expect(T.decode({ type: 'Pending', progress: null })).toEqual(Either_1.right(remote_data_1.pending));
        expect(T.decode({ type: 'Pending', progress: { loaded: 2, total: null } })).toEqual(Either_1.right(remote_data_1.progress({ loaded: 2, total: Option_1.none })));
        expect(T.decode({ type: 'Pending', progress: { loaded: 2, total: 5 } })).toEqual(Either_1.right(remote_data_1.progress({ loaded: 2, total: Option_1.some(5) })));
        expect(T.decode({ type: 'Success', value: 42 })).toEqual(Either_1.right(remote_data_1.success(42)));
        expect(T.encode(remote_data_1.failure('error'))).toEqual({ type: 'Failure', error: 'error' });
        expect(T.encode(remote_data_1.initial)).toEqual({ type: 'Initial' });
        expect(T.encode(remote_data_1.pending)).toEqual({ type: 'Pending', progress: null });
        expect(T.encode(remote_data_1.progress({ loaded: 2, total: Option_1.none }))).toEqual({
            type: 'Pending',
            progress: { loaded: 2, total: null },
        });
        expect(T.encode(remote_data_1.progress({ loaded: 2, total: Option_1.some(5) }))).toEqual({
            type: 'Pending',
            progress: { loaded: 2, total: 5 },
        });
        expect(T.encode(remote_data_1.success(42))).toEqual({ type: 'Success', value: 42 });
        expect(T.is(remote_data_1.failure('error'))).toBe(true);
        expect(T.is(remote_data_1.initial)).toBe(true);
        expect(T.is(remote_data_1.pending)).toBe(true);
        expect(T.is(remote_data_1.success(42))).toBe(true);
        expect(T.is(remote_data_1.failure(1))).toBe(false);
        expect(T.is(remote_data_1.success('invalid'))).toBe(false);
    });
});
