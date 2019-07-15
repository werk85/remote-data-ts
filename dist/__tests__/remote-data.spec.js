"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var remote_data_1 = require("../remote-data");
var function_1 = require("fp-ts/lib/function");
var Option_1 = require("fp-ts/lib/Option");
var Array_1 = require("fp-ts/lib/Array");
var Eq_1 = require("fp-ts/lib/Eq");
var Ord_1 = require("fp-ts/lib/Ord");
var Semigroup_1 = require("fp-ts/lib/Semigroup");
var Monoid_1 = require("fp-ts/lib/Monoid");
var Either_1 = require("fp-ts/lib/Either");
var RD = require("../remote-data");
var pipeable_1 = require("fp-ts/lib/pipeable");
describe('RemoteData', function () {
    var double = function (x) { return x * 2; };
    var initialRD = remote_data_1.initial;
    var pendingRD = remote_data_1.pending;
    var successRD = remote_data_1.success(1);
    var failureRD = remote_data_1.failure('foo');
    var progressRD = remote_data_1.progress({ loaded: 1, total: Option_1.none });
    describe('Functor', function () {
        describe('should map over value', function () {
            it('initial', function () {
                expect(RD.remoteData.map(remote_data_1.initial, double)).toBe(remote_data_1.initial);
            });
            it('pending', function () {
                expect(RD.remoteData.map(remote_data_1.pending, double)).toBe(remote_data_1.pending);
            });
            it('failure', function () {
                var failed = remote_data_1.failure('foo');
                expect(RD.remoteData.map(failed, double)).toBe(failed);
            });
            it('success', function () {
                var value = 123;
                var succeeded = remote_data_1.success(value);
                var result = RD.remoteData.map(succeeded, double);
                expect(result).toEqual(remote_data_1.success(value * 2));
            });
        });
        describe('laws', function () {
            describe('identity', function () {
                it('initial', function () {
                    expect(RD.remoteData.map(remote_data_1.initial, function_1.identity)).toBe(remote_data_1.initial);
                });
                it('pending', function () {
                    expect(RD.remoteData.map(remote_data_1.pending, function_1.identity)).toBe(remote_data_1.pending);
                });
                it('failure', function () {
                    var failed = remote_data_1.failure('foo');
                    expect(RD.remoteData.map(failed, function_1.identity)).toBe(failed);
                });
                it('success', function () {
                    var succeeded = remote_data_1.success('foo');
                    var result = RD.remoteData.map(succeeded, function_1.identity);
                    expect(result).toEqual(succeeded);
                    expect(result).not.toBe(succeeded);
                });
            });
            describe('composition', function () {
                var double = function (a) { return a * 2; };
                var quad = function_1.flow(double, double);
                it('initial', function () {
                    expect(RD.remoteData.map(remote_data_1.initial, quad)).toBe(pipeable_1.pipe(remote_data_1.initial, RD.map(double), RD.map(double)));
                });
                it('pending', function () {
                    expect(RD.remoteData.map(remote_data_1.pending, quad)).toBe(pipeable_1.pipe(remote_data_1.pending, RD.map(double), RD.map(double)));
                });
                it('failure', function () {
                    var failed = remote_data_1.failure('foo');
                    expect(RD.remoteData.map(failed, quad)).toBe(pipeable_1.pipe(failed, RD.map(double), RD.map(double)));
                });
                it('success', function () {
                    var value = 1;
                    var succeeded = remote_data_1.success(value);
                    expect(RD.remoteData.map(succeeded, quad)).toEqual(remote_data_1.success(quad(value)));
                });
            });
        });
    });
    describe('Alt', function () {
        describe('should alt', function () {
            it('initial', function () {
                expect(RD.remoteData.alt(initialRD, function () { return initialRD; })).toBe(initialRD);
                expect(RD.remoteData.alt(initialRD, function () { return pendingRD; })).toBe(pendingRD);
                expect(RD.remoteData.alt(initialRD, function () { return failureRD; })).toBe(failureRD);
                expect(RD.remoteData.alt(initialRD, function () { return successRD; })).toBe(successRD);
            });
            it('pending', function () {
                expect(RD.remoteData.alt(pendingRD, function () { return initialRD; })).toBe(initialRD);
                expect(RD.remoteData.alt(pendingRD, function () { return pendingRD; })).toBe(pendingRD);
                expect(RD.remoteData.alt(pendingRD, function () { return failureRD; })).toBe(failureRD);
                expect(RD.remoteData.alt(pendingRD, function () { return successRD; })).toBe(successRD);
            });
            it('failure', function () {
                expect(RD.remoteData.alt(failureRD, function () { return pendingRD; })).toBe(pendingRD);
                expect(RD.remoteData.alt(failureRD, function () { return initialRD; })).toBe(initialRD);
                expect(RD.remoteData.alt(failureRD, function () { return failureRD; })).toBe(failureRD);
                expect(RD.remoteData.alt(failureRD, function () { return successRD; })).toBe(successRD);
            });
            it('failure', function () {
                expect(RD.remoteData.alt(successRD, function () { return pendingRD; })).toBe(successRD);
                expect(RD.remoteData.alt(successRD, function () { return initialRD; })).toBe(successRD);
                expect(RD.remoteData.alt(successRD, function () { return failureRD; })).toBe(successRD);
                expect(RD.remoteData.alt(successRD, function () { return successRD; })).toBe(successRD);
            });
        });
    });
    describe('Apply', function () {
        describe('should ap', function () {
            var f = remote_data_1.success(double);
            var failedF = remote_data_1.failure('foo');
            it('initial', function () {
                expect(RD.remoteData.ap(remote_data_1.initial, initialRD)).toBe(initialRD);
                expect(RD.remoteData.ap(remote_data_1.pending, initialRD)).toBe(initialRD);
                expect(RD.remoteData.ap(progressRD, initialRD)).toBe(initialRD);
                expect(RD.remoteData.ap(failedF, initialRD)).toBe(failedF);
                expect(RD.remoteData.ap(f, initialRD)).toBe(initialRD);
            });
            it('pending', function () {
                expect(RD.remoteData.ap(remote_data_1.initial, pendingRD)).toBe(remote_data_1.initial);
                expect(RD.remoteData.ap(remote_data_1.pending, pendingRD)).toBe(pendingRD);
                expect(RD.remoteData.ap(progressRD, pendingRD)).toBe(progressRD);
                expect(RD.remoteData.ap(failedF, pendingRD)).toBe(failedF);
                expect(RD.remoteData.ap(f, pendingRD)).toBe(pendingRD);
            });
            it('failure', function () {
                expect(RD.remoteData.ap(remote_data_1.initial, failureRD)).toBe(failureRD);
                expect(RD.remoteData.ap(remote_data_1.pending, failureRD)).toBe(failureRD);
                expect(RD.remoteData.ap(progressRD, failureRD)).toBe(failureRD);
                expect(RD.remoteData.ap(failedF, failureRD)).toBe(failedF);
                expect(RD.remoteData.ap(f, failureRD)).toBe(failureRD);
            });
            it('success', function () {
                expect(RD.remoteData.ap(remote_data_1.initial, successRD)).toBe(remote_data_1.initial);
                expect(RD.remoteData.ap(remote_data_1.pending, successRD)).toBe(remote_data_1.pending);
                expect(RD.remoteData.ap(progressRD, successRD)).toBe(progressRD);
                expect(RD.remoteData.ap(failedF, successRD)).toBe(failedF);
                expect(RD.remoteData.ap(f, successRD)).toEqual(remote_data_1.success(double(1)));
            });
        });
    });
    describe('Applicative', function () {
        describe('sequence', function () {
            var s = Array_1.array.sequence(remote_data_1.remoteData);
            it('initial', function () {
                expect(s([initialRD, successRD])).toBe(initialRD);
            });
            it('pending', function () {
                expect(s([pendingRD, successRD])).toBe(pendingRD);
            });
            it('failure', function () {
                expect(s([failureRD, successRD])).toBe(failureRD);
            });
            it('success', function () {
                expect(s([remote_data_1.success(123), remote_data_1.success(456)])).toEqual(remote_data_1.success([123, 456]));
            });
        });
    });
    describe('Chain', function () {
        describe('chain', function () {
            it('initial', function () {
                expect(RD.remoteData.chain(initialRD, function () { return initialRD; })).toBe(initialRD);
                expect(RD.remoteData.chain(initialRD, function () { return pendingRD; })).toBe(initialRD);
                expect(RD.remoteData.chain(initialRD, function () { return failureRD; })).toBe(initialRD);
                expect(RD.remoteData.chain(initialRD, function () { return successRD; })).toBe(initialRD);
            });
            it('pending', function () {
                expect(RD.remoteData.chain(pendingRD, function () { return initialRD; })).toBe(pendingRD);
                expect(RD.remoteData.chain(pendingRD, function () { return pendingRD; })).toBe(pendingRD);
                expect(RD.remoteData.chain(pendingRD, function () { return failureRD; })).toBe(pendingRD);
                expect(RD.remoteData.chain(pendingRD, function () { return successRD; })).toBe(pendingRD);
            });
            it('failure', function () {
                expect(RD.remoteData.chain(failureRD, function () { return initialRD; })).toBe(failureRD);
                expect(RD.remoteData.chain(failureRD, function () { return pendingRD; })).toBe(failureRD);
                expect(RD.remoteData.chain(failureRD, function () { return failureRD; })).toBe(failureRD);
                expect(RD.remoteData.chain(failureRD, function () { return successRD; })).toBe(failureRD);
            });
            it('success', function () {
                expect(RD.remoteData.chain(successRD, function () { return initialRD; })).toBe(initialRD);
                expect(RD.remoteData.chain(successRD, function () { return pendingRD; })).toBe(pendingRD);
                expect(RD.remoteData.chain(successRD, function () { return failureRD; })).toBe(failureRD);
                expect(RD.remoteData.chain(successRD, function () { return successRD; })).toBe(successRD);
            });
        });
    });
    describe('Extend', function () {
        describe('extend', function () {
            var f = function () { return 1; };
            it('initial', function () {
                expect(RD.remoteData.extend(initialRD, f)).toBe(initialRD);
            });
            it('pending', function () {
                expect(RD.remoteData.extend(pendingRD, f)).toBe(pendingRD);
            });
            it('failure', function () {
                expect(RD.remoteData.extend(failureRD, f)).toBe(failureRD);
            });
            it('pending', function () {
                expect(RD.remoteData.extend(successRD, f)).toEqual(remote_data_1.success(1));
            });
        });
    });
    describe('Traversable2v', function () {
        describe('traverse', function () {
            var t = remote_data_1.remoteData.traverse(Option_1.option);
            var f = function (x) { return (x >= 2 ? Option_1.some(x) : Option_1.none); };
            it('initial', function () {
                expect(t(initialRD, f)).toEqual(Option_1.some(initialRD));
            });
            it('pending', function () {
                expect(t(pendingRD, f)).toEqual(Option_1.some(pendingRD));
            });
            it('failure', function () {
                expect(t(failureRD, f)).toEqual(Option_1.some(failureRD));
            });
            it('success', function () {
                expect(t(remote_data_1.success(1), f)).toBe(Option_1.none);
                expect(t(remote_data_1.success(3), f)).toEqual(Option_1.some(remote_data_1.success(3)));
            });
        });
    });
    describe('Foldable2v', function () {
        describe('reduce', function () {
            var f = function (a, b) { return a + b; };
            var g = function (a) { return a + 1; };
            it('initial', function () {
                expect(RD.remoteData.reduce(initialRD, 1, f)).toBe(1);
                expect(RD.remoteData.foldMap(Monoid_1.monoidSum)(initialRD, g)).toBe(0);
                expect(RD.remoteData.reduceRight(initialRD, 1, f)).toBe(1);
            });
            it('pending', function () {
                expect(RD.remoteData.reduce(pendingRD, 1, f)).toBe(1);
                expect(RD.remoteData.foldMap(Monoid_1.monoidSum)(pendingRD, g)).toBe(0);
                expect(RD.remoteData.reduceRight(pendingRD, 1, f)).toBe(1);
            });
            it('failure', function () {
                expect(RD.remoteData.reduce(failureRD, 1, f)).toBe(1);
                expect(RD.remoteData.foldMap(Monoid_1.monoidSum)(failureRD, g)).toBe(0);
                expect(RD.remoteData.reduceRight(failureRD, 1, f)).toBe(1);
            });
            it('success', function () {
                expect(RD.remoteData.reduce(successRD, 1, f)).toBe(2);
                expect(RD.remoteData.foldMap(Monoid_1.monoidSum)(successRD, g)).toBe(2);
                expect(RD.remoteData.reduceRight(successRD, 1, f)).toBe(2);
            });
        });
    });
    describe('Bifunctor', function () {
        describe('bimap', function () {
            var f = function (l) { return "Error: " + l; };
            var g = function (a) { return a + 1; };
            it('initial', function () {
                expect(RD.remoteData.bimap(initialRD, f, g)).toBe(remote_data_1.initial);
                expect(RD.remoteData.bimap(initialRD, function_1.identity, function_1.identity)).toBe(remote_data_1.initial);
            });
            it('pending', function () {
                expect(RD.remoteData.bimap(pendingRD, f, g)).toBe(remote_data_1.pending);
                expect(RD.remoteData.bimap(pendingRD, function_1.identity, function_1.identity)).toBe(remote_data_1.pending);
            });
            it('failure', function () {
                expect(RD.remoteData.bimap(failureRD, f, g)).toEqual(failureRD.mapLeft(f));
                expect(RD.remoteData.bimap(failureRD, f, g)).toEqual(remote_data_1.failure('Error: foo'));
                expect(RD.remoteData.bimap(failureRD, function_1.identity, function_1.identity)).toEqual(failureRD);
            });
            it('success', function () {
                expect(RD.remoteData.bimap(successRD, f, g)).toEqual(successRD.map(g));
                expect(RD.remoteData.bimap(successRD, f, g)).toEqual(remote_data_1.success(2));
                expect(RD.remoteData.bimap(successRD, function_1.identity, function_1.identity)).toEqual(successRD);
            });
        });
    });
    describe('Alternative', function () {
        it('zero', function () {
            expect(remote_data_1.remoteData.zero()).toBe(remote_data_1.initial);
        });
    });
    describe('Setoid', function () {
        describe('getSetoid', function () {
            var equals = remote_data_1.getEq(Eq_1.eqString, Eq_1.eqNumber).equals;
            it('initial', function () {
                expect(equals(initialRD, initialRD)).toBe(true);
                expect(equals(initialRD, pendingRD)).toBe(false);
                expect(equals(initialRD, failureRD)).toBe(false);
                expect(equals(initialRD, successRD)).toBe(false);
            });
            it('pending', function () {
                expect(equals(pendingRD, initialRD)).toBe(false);
                expect(equals(pendingRD, pendingRD)).toBe(true);
                expect(equals(pendingRD, failureRD)).toBe(false);
                expect(equals(pendingRD, successRD)).toBe(false);
            });
            it('failure', function () {
                expect(equals(failureRD, initialRD)).toBe(false);
                expect(equals(failureRD, pendingRD)).toBe(false);
                expect(equals(failureRD, failureRD)).toBe(true);
                expect(equals(remote_data_1.failure('1'), remote_data_1.failure('2'))).toBe(false);
                expect(equals(failureRD, successRD)).toBe(false);
            });
            it('success', function () {
                expect(equals(successRD, initialRD)).toBe(false);
                expect(equals(successRD, pendingRD)).toBe(false);
                expect(equals(successRD, failureRD)).toBe(false);
                expect(equals(successRD, successRD)).toBe(true);
                expect(equals(remote_data_1.success(1), remote_data_1.success(2))).toBe(false);
            });
        });
    });
    describe('Ord', function () {
        describe('getOrd', function () {
            var compare = remote_data_1.getOrd(Ord_1.ordString, Ord_1.ordNumber).compare;
            it('initial', function () {
                expect(compare(initialRD, initialRD)).toBe(0);
                expect(compare(initialRD, pendingRD)).toBe(-1);
                expect(compare(initialRD, failureRD)).toBe(-1);
                expect(compare(initialRD, successRD)).toBe(-1);
            });
            it('pending', function () {
                expect(compare(pendingRD, initialRD)).toBe(1);
                expect(compare(pendingRD, pendingRD)).toBe(0);
                expect(compare(pendingRD, failureRD)).toBe(-1);
                expect(compare(pendingRD, successRD)).toBe(-1);
            });
            it('failure', function () {
                expect(compare(failureRD, initialRD)).toBe(1);
                expect(compare(failureRD, pendingRD)).toBe(1);
                expect(compare(failureRD, failureRD)).toBe(0);
                expect(compare(failureRD, successRD)).toBe(-1);
                expect(compare(remote_data_1.failure('1'), remote_data_1.failure('2'))).toBe(-1);
                expect(compare(remote_data_1.failure('2'), remote_data_1.failure('1'))).toBe(1);
            });
            it('success', function () {
                expect(compare(successRD, initialRD)).toBe(1);
                expect(compare(successRD, pendingRD)).toBe(1);
                expect(compare(successRD, failureRD)).toBe(1);
                expect(compare(successRD, successRD)).toBe(0);
                expect(compare(remote_data_1.success(1), remote_data_1.success(2))).toBe(-1);
                expect(compare(remote_data_1.success(2), remote_data_1.success(1))).toBe(1);
            });
        });
    });
    describe('Semigroup', function () {
        describe('getSemigroup', function () {
            var concat = remote_data_1.getSemigroup(Semigroup_1.semigroupString, Semigroup_1.semigroupSum).concat;
            it('initial', function () {
                expect(concat(initialRD, initialRD)).toBe(initialRD);
                expect(concat(initialRD, pendingRD)).toBe(pendingRD);
                expect(concat(initialRD, failureRD)).toBe(failureRD);
                expect(concat(initialRD, successRD)).toBe(successRD);
            });
            it('pending', function () {
                expect(concat(pendingRD, initialRD)).toBe(pendingRD);
                expect(concat(pendingRD, pendingRD)).toBe(pendingRD);
                expect(concat(pendingRD, failureRD)).toBe(failureRD);
                expect(concat(pendingRD, successRD)).toBe(successRD);
            });
            it('failure', function () {
                expect(concat(failureRD, initialRD)).toBe(failureRD);
                expect(concat(failureRD, pendingRD)).toBe(failureRD);
                expect(concat(remote_data_1.failure('foo'), remote_data_1.failure('bar'))).toEqual(remote_data_1.failure(Semigroup_1.semigroupString.concat('foo', 'bar')));
                expect(concat(failureRD, successRD)).toBe(successRD);
            });
            it('success', function () {
                expect(concat(successRD, initialRD)).toBe(successRD);
                expect(concat(successRD, pendingRD)).toBe(successRD);
                expect(concat(successRD, failureRD)).toBe(successRD);
                expect(concat(remote_data_1.success(1), remote_data_1.success(1))).toEqual(remote_data_1.success(Semigroup_1.semigroupSum.concat(1, 1)));
            });
            describe('progress', function () {
                it('should concat pendings without progress', function () {
                    expect(concat(remote_data_1.pending, remote_data_1.pending)).toEqual(remote_data_1.pending);
                });
                it('should concat pending and progress', function () {
                    var withProgress = remote_data_1.progress({ loaded: 1, total: Option_1.none });
                    expect(concat(remote_data_1.pending, withProgress)).toBe(withProgress);
                });
                it('should concat progress without total', function () {
                    var withProgress = remote_data_1.progress({ loaded: 1, total: Option_1.none });
                    expect(concat(withProgress, withProgress)).toEqual(remote_data_1.progress({ loaded: 2, total: Option_1.none }));
                });
                it('should concat progress without total and progress with total', function () {
                    var withProgress = remote_data_1.progress({ loaded: 1, total: Option_1.none });
                    var withProgressAndTotal = remote_data_1.progress({ loaded: 1, total: Option_1.some(2) });
                    expect(concat(withProgress, withProgressAndTotal)).toEqual(remote_data_1.progress({ loaded: 2, total: Option_1.none }));
                });
                it('should combine progresses with total', function () {
                    var expected = remote_data_1.progress({
                        loaded: (2 * 10 + 2 * 30) / (40 * 40),
                        total: Option_1.some(10 + 30),
                    });
                    expect(concat(remote_data_1.progress({ loaded: 2, total: Option_1.some(10) }), remote_data_1.progress({ loaded: 2, total: Option_1.some(30) }))).toEqual(expected);
                });
            });
        });
    });
    describe('Monoid', function () {
        it('getMonoid', function () {
            var empty = remote_data_1.getMonoid(Monoid_1.monoidString, Monoid_1.monoidSum).empty;
            expect(empty).toBe(remote_data_1.initial);
        });
    });
    describe('helpers', function () {
        describe('combine', function () {
            it('should combine all initials to initial', function () {
                expect(remote_data_1.combine(remote_data_1.initial, remote_data_1.initial)).toBe(remote_data_1.initial);
            });
            it('should combine all pendings to pending', function () {
                expect(remote_data_1.combine(remote_data_1.pending, remote_data_1.pending)).toBe(remote_data_1.pending);
            });
            it('should combine all failures to first failure', function () {
                expect(remote_data_1.combine(remote_data_1.failure('foo'), remote_data_1.failure('bar'))).toEqual(remote_data_1.failure('foo'));
            });
            it('should combine all successes to success of list of values', function () {
                expect(remote_data_1.combine(remote_data_1.success('foo'), remote_data_1.success('bar'))).toEqual(remote_data_1.success(['foo', 'bar']));
            });
            it('should combine arbitrary non-failure values to first initial', function () {
                expect(remote_data_1.combine(remote_data_1.success(123), remote_data_1.success('foo'), remote_data_1.pending, remote_data_1.initial)).toBe(remote_data_1.initial);
                expect(remote_data_1.combine(remote_data_1.initial, remote_data_1.pending, remote_data_1.success('foo'), remote_data_1.success(123))).toBe(remote_data_1.initial);
            });
            it('should combine arbitrary non-failure & non-initial values to first pending', function () {
                expect(remote_data_1.combine(remote_data_1.success(123), remote_data_1.success('foo'), remote_data_1.pending)).toBe(remote_data_1.pending);
                expect(remote_data_1.combine(remote_data_1.pending, remote_data_1.success('foo'), remote_data_1.success(123))).toBe(remote_data_1.pending);
            });
            it('should combine arbitrary values to first failure', function () {
                expect(remote_data_1.combine(remote_data_1.success(123), remote_data_1.success('foo'), remote_data_1.failure('bar'))).toEqual(remote_data_1.failure('bar'));
                expect(remote_data_1.combine(remote_data_1.failure('bar'), remote_data_1.success('foo'), remote_data_1.success(123))).toEqual(remote_data_1.failure('bar'));
            });
            describe('progress', function () {
                it('should combine pendings without progress', function () {
                    expect(remote_data_1.combine(remote_data_1.pending, remote_data_1.pending)).toBe(remote_data_1.pending);
                    expect(remote_data_1.combine(remote_data_1.pending, remote_data_1.pending, remote_data_1.pending)).toBe(remote_data_1.pending);
                    expect(remote_data_1.combine(remote_data_1.pending, remote_data_1.pending, remote_data_1.pending, remote_data_1.pending)).toBe(remote_data_1.pending);
                });
                it('should combine pending and progress', function () {
                    var withProgress = remote_data_1.progress({ loaded: 1, total: Option_1.none });
                    expect(remote_data_1.combine(remote_data_1.pending, withProgress)).toBe(withProgress);
                    expect(remote_data_1.combine(withProgress, remote_data_1.pending)).toBe(withProgress);
                });
                it('should combine progress without total', function () {
                    var withProgress = remote_data_1.progress({ loaded: 1, total: Option_1.none });
                    expect(remote_data_1.combine(withProgress, withProgress)).toEqual(remote_data_1.progress({ loaded: 2, total: Option_1.none }));
                    expect(remote_data_1.combine(withProgress, withProgress, withProgress)).toEqual(remote_data_1.progress({ loaded: 3, total: Option_1.none }));
                });
                it('should combine progress without total and progress with total', function () {
                    var withProgress = remote_data_1.progress({ loaded: 1, total: Option_1.none });
                    var withProgressAndTotal = remote_data_1.progress({ loaded: 1, total: Option_1.some(2) });
                    expect(remote_data_1.combine(withProgress, withProgressAndTotal)).toEqual(remote_data_1.progress({ loaded: 2, total: Option_1.none }));
                    expect(remote_data_1.combine(withProgressAndTotal, withProgress)).toEqual(remote_data_1.progress({ loaded: 2, total: Option_1.none }));
                });
                it('should combine progresses with total', function () {
                    var expected = remote_data_1.progress({
                        loaded: (2 * 10 + 2 * 30) / (40 * 40),
                        total: Option_1.some(10 + 30),
                    });
                    expect(remote_data_1.combine(remote_data_1.progress({ loaded: 2, total: Option_1.some(10) }), remote_data_1.progress({ loaded: 2, total: Option_1.some(30) }))).toEqual(expected);
                    expect(remote_data_1.combine(remote_data_1.progress({ loaded: 2, total: Option_1.some(30) }), remote_data_1.progress({ loaded: 2, total: Option_1.some(10) }))).toEqual(expected);
                });
            });
        });
        describe('fromOption', function () {
            var error = new Error('foo');
            it('none', function () {
                expect(remote_data_1.fromOption(Option_1.none, function () { return error; })).toEqual(remote_data_1.failure(error));
            });
            it('some', function () {
                expect(remote_data_1.fromOption(Option_1.some(123), function () { return error; })).toEqual(remote_data_1.success(123));
            });
        });
        describe('fromEither', function () {
            it('left', function () {
                expect(remote_data_1.fromEither(Either_1.left('123'))).toEqual(remote_data_1.failure('123'));
            });
            it('right', function () {
                expect(remote_data_1.fromEither(Either_1.right('123'))).toEqual(remote_data_1.success('123'));
            });
        });
        describe('fromPredicate', function () {
            var factory = remote_data_1.fromPredicate(function (value) { return value; }, function () { return '123'; });
            it('false', function () {
                expect(factory(false)).toEqual(remote_data_1.failure('123'));
            });
            it('true', function () {
                expect(factory(true)).toEqual(remote_data_1.success(true));
            });
        });
        describe('fromProgressEvent', function () {
            var e = new ProgressEvent('test');
            it('lengthComputable === false', function () {
                expect(remote_data_1.fromProgressEvent(tslib_1.__assign({}, e, { loaded: 123 }))).toEqual(remote_data_1.progress({ loaded: 123, total: Option_1.none }));
            });
            it('lengthComputable === true', function () {
                expect(remote_data_1.fromProgressEvent(tslib_1.__assign({}, e, { loaded: 123, lengthComputable: true, total: 1000 }))).toEqual(remote_data_1.progress({ loaded: 123, total: Option_1.some(1000) }));
            });
        });
        describe('getOrElse', function () {
            it('initial', function () {
                expect(RD.getOrElse(function () { return 0; })(initialRD)).toBe(0);
            });
            it('pending', function () {
                expect(RD.getOrElse(function () { return 0; })(pendingRD)).toBe(0);
            });
            it('failure', function () {
                expect(RD.getOrElse(function () { return 0; })(failureRD)).toBe(0);
            });
            it('success', function () {
                expect(RD.getOrElse(function () { return 0; })(remote_data_1.success(1))).toBe(1);
            });
        });
        describe('fold', function () {
            it('initial', function () {
                expect(RD.fold(function () { return 1; }, function () { return 2; }, function () { return 3; }, function () { return 4; })(initialRD)).toBe(1);
            });
            it('pending', function () {
                expect(RD.fold(function () { return 1; }, function () { return 2; }, function () { return 3; }, function () { return 4; })(pendingRD)).toBe(2);
            });
            it('failure', function () {
                expect(RD.fold(function () { return 1; }, function () { return 2; }, function () { return 3; }, function () { return 4; })(failureRD)).toBe(3);
            });
            it('success', function () {
                expect(RD.fold(function () { return 1; }, function () { return 2; }, function () { return 3; }, function () { return 4; })(successRD)).toBe(4);
            });
        });
    });
    describe('instance methods', function () {
        describe('getOrElse', function () {
            it('initial', function () {
                expect(initialRD.getOrElse(0)).toBe(0);
            });
            it('pending', function () {
                expect(pendingRD.getOrElse(0)).toBe(0);
            });
            it('failure', function () {
                expect(failureRD.getOrElse(0)).toBe(0);
            });
            it('success', function () {
                expect(remote_data_1.success(1).getOrElse(0)).toBe(1);
            });
        });
        describe('getOrElseL', function () {
            it('initial', function () {
                expect(initialRD.getOrElseL(function () { return 0; })).toBe(0);
            });
            it('pending', function () {
                expect(pendingRD.getOrElseL(function () { return 0; })).toBe(0);
            });
            it('failure', function () {
                expect(failureRD.getOrElseL(function () { return 0; })).toBe(0);
            });
            it('success', function () {
                expect(remote_data_1.success(1).getOrElseL(function () { return 0; })).toBe(1);
            });
        });
        describe('fold', function () {
            it('initial', function () {
                expect(initialRD.fold(1, 2, function () { return 3; }, function () { return 4; })).toBe(1);
            });
            it('pending', function () {
                expect(pendingRD.fold(1, 2, function () { return 3; }, function () { return 4; })).toBe(2);
            });
            it('failure', function () {
                expect(failureRD.fold(1, 2, function () { return 3; }, function () { return 4; })).toBe(3);
            });
            it('success', function () {
                expect(successRD.fold(1, 2, function () { return 3; }, function () { return 4; })).toBe(4);
            });
        });
        describe('foldL', function () {
            it('initial', function () {
                expect(initialRD.foldL(function () { return 1; }, function () { return 2; }, function () { return 3; }, function () { return 4; })).toBe(1);
            });
            it('pending', function () {
                expect(pendingRD.foldL(function () { return 1; }, function () { return 2; }, function () { return 3; }, function () { return 4; })).toBe(2);
            });
            it('failure', function () {
                expect(failureRD.foldL(function () { return 1; }, function () { return 2; }, function () { return 3; }, function () { return 4; })).toBe(3);
            });
            it('success', function () {
                expect(successRD.foldL(function () { return 1; }, function () { return 2; }, function () { return 3; }, function () { return 4; })).toBe(4);
            });
        });
        describe('altL', function () {
            it('initial', function () {
                expect(initialRD.altL(function () { return initialRD; })).toBe(initialRD);
                expect(initialRD.altL(function () { return pendingRD; })).toBe(pendingRD);
                expect(initialRD.altL(function () { return failureRD; })).toBe(failureRD);
                expect(initialRD.altL(function () { return successRD; })).toBe(successRD);
            });
            it('pending', function () {
                expect(pendingRD.altL(function () { return initialRD; })).toBe(initialRD);
                expect(pendingRD.altL(function () { return pendingRD; })).toBe(pendingRD);
                expect(pendingRD.altL(function () { return failureRD; })).toBe(failureRD);
                expect(pendingRD.altL(function () { return successRD; })).toBe(successRD);
            });
            it('failure', function () {
                expect(failureRD.altL(function () { return pendingRD; })).toBe(pendingRD);
                expect(failureRD.altL(function () { return initialRD; })).toBe(initialRD);
                expect(failureRD.altL(function () { return failureRD; })).toBe(failureRD);
                expect(failureRD.altL(function () { return successRD; })).toBe(successRD);
            });
            it('failure', function () {
                expect(successRD.altL(function () { return pendingRD; })).toBe(successRD);
                expect(successRD.altL(function () { return initialRD; })).toBe(successRD);
                expect(successRD.altL(function () { return failureRD; })).toBe(successRD);
                expect(successRD.altL(function () { return successRD; })).toBe(successRD);
            });
        });
        describe('mapLeft', function () {
            var f2 = function () { return 1; };
            it('initial', function () {
                expect(initialRD.mapLeft(f2)).toBe(initialRD);
            });
            it('pending', function () {
                expect(pendingRD.mapLeft(f2)).toBe(pendingRD);
            });
            it('failure', function () {
                expect(failureRD.mapLeft(f2)).toEqual(remote_data_1.failure(1));
            });
            it('success', function () {
                expect(successRD.mapLeft(f2)).toBe(successRD);
            });
        });
        describe('isInitial', function () {
            it('initial', function () {
                expect(initialRD.isInitial()).toBe(true);
            });
            it('pending', function () {
                expect(pendingRD.isInitial()).toBe(false);
            });
            it('failure', function () {
                expect(failureRD.isInitial()).toEqual(false);
            });
            it('success', function () {
                expect(successRD.isInitial()).toBe(false);
            });
        });
        describe('isPending', function () {
            it('initial', function () {
                expect(initialRD.isPending()).toBe(false);
            });
            it('pending', function () {
                expect(pendingRD.isPending()).toBe(true);
            });
            it('failure', function () {
                expect(failureRD.isPending()).toEqual(false);
            });
            it('success', function () {
                expect(successRD.isPending()).toBe(false);
            });
        });
        describe('isFailure', function () {
            it('initial', function () {
                expect(initialRD.isFailure()).toBe(false);
            });
            it('pending', function () {
                expect(pendingRD.isFailure()).toBe(false);
            });
            it('failure', function () {
                expect(failureRD.isFailure()).toEqual(true);
                if (failureRD.isFailure()) {
                    expect(failureRD.error).toBeDefined();
                }
            });
            it('success', function () {
                expect(successRD.isFailure()).toBe(false);
            });
        });
        describe('isSuccess', function () {
            it('initial', function () {
                expect(initialRD.isSuccess()).toBe(false);
            });
            it('pending', function () {
                expect(pendingRD.isSuccess()).toBe(false);
            });
            it('failure', function () {
                expect(failureRD.isSuccess()).toEqual(false);
            });
            it('success', function () {
                expect(successRD.isSuccess()).toBe(true);
                if (successRD.isSuccess()) {
                    expect(successRD.value).toBeDefined();
                }
            });
        });
        describe('toOption', function () {
            it('initial', function () {
                expect(initialRD.toOption()).toBe(Option_1.none);
            });
            it('pending', function () {
                expect(pendingRD.toOption()).toBe(Option_1.none);
            });
            it('failure', function () {
                expect(failureRD.toOption()).toBe(Option_1.none);
            });
            it('success', function () {
                expect(remote_data_1.success(1).toOption()).toEqual(Option_1.some(1));
            });
        });
        describe('toEither', function () {
            it('initial', function () {
                expect(initialRD.toEither('initial', 'pending')).toEqual(Either_1.left('initial'));
            });
            it('pending', function () {
                expect(pendingRD.toEither('initial', 'pending')).toEqual(Either_1.left('pending'));
            });
            it('failure', function () {
                expect(failureRD.toEither('initial', 'pending')).toEqual(Either_1.left('foo'));
            });
            it('success', function () {
                expect(remote_data_1.success(1).toEither('initial', 'pending')).toEqual(Either_1.right(1));
            });
        });
        describe('toEitherL', function () {
            var initialL = function () { return 'initial'; };
            var pendingL = function () { return 'pending'; };
            it('initial', function () {
                expect(initialRD.toEitherL(initialL, pendingL)).toEqual(Either_1.left('initial'));
            });
            it('pending', function () {
                expect(pendingRD.toEitherL(initialL, pendingL)).toEqual(Either_1.left('pending'));
            });
            it('failure', function () {
                expect(failureRD.toEitherL(initialL, pendingL)).toEqual(Either_1.left('foo'));
            });
            it('success', function () {
                expect(remote_data_1.success(1).toEitherL(initialL, pendingL)).toEqual(Either_1.right(1));
            });
        });
        describe('toNullable', function () {
            it('initial', function () {
                expect(initialRD.toNullable()).toBe(null);
            });
            it('pending', function () {
                expect(pendingRD.toNullable()).toBe(null);
            });
            it('failure', function () {
                expect(failureRD.toNullable()).toBe(null);
            });
            it('success', function () {
                expect(remote_data_1.success(1).toNullable()).toEqual(1);
            });
        });
        describe('toString', function () {
            it('initial', function () {
                expect(initialRD.toString()).toBe('initial');
            });
            it('pending', function () {
                expect(pendingRD.toString()).toBe('pending');
            });
            it('failure', function () {
                expect(remote_data_1.failure('foo').toString()).toBe('failure(foo)');
            });
            it('success', function () {
                expect(remote_data_1.success(1).toString()).toBe('success(1)');
            });
        });
        describe('contains', function () {
            it('initial', function () {
                expect(initialRD.contains(Eq_1.eqNumber, 1)).toBe(false);
            });
            it('pending', function () {
                expect(pendingRD.contains(Eq_1.eqNumber, 1)).toBe(false);
            });
            it('failure', function () {
                expect(failureRD.contains(Eq_1.eqNumber, 1)).toBe(false);
            });
            it('success', function () {
                expect(remote_data_1.success(2).contains(Eq_1.eqNumber, 1)).toBe(false);
                expect(remote_data_1.success(1).contains(Eq_1.eqNumber, 1)).toBe(true);
            });
        });
        describe('exists', function () {
            var p = function (n) { return n === 1; };
            it('initial', function () {
                expect(initialRD.exists(p)).toBe(false);
            });
            it('pending', function () {
                expect(pendingRD.exists(p)).toBe(false);
            });
            it('failure', function () {
                expect(failureRD.exists(p)).toBe(false);
            });
            it('success', function () {
                expect(remote_data_1.success(2).exists(p)).toBe(false);
                expect(remote_data_1.success(1).exists(p)).toBe(true);
            });
        });
        describe('recover', function () {
            var f = function (error) { return (error === 'foo' ? Option_1.some(1) : Option_1.none); };
            it('initial', function () {
                expect(initialRD.recover(f)).toBe(initialRD);
            });
            it('pending', function () {
                expect(pendingRD.recover(f)).toBe(pendingRD);
            });
            it('failure', function () {
                expect(remote_data_1.failure('foo').recover(f)).toEqual(remote_data_1.success(1));
            });
            it('success', function () {
                expect(successRD.recover(f)).toBe(successRD);
            });
        });
        describe('recoverMap', function () {
            var f = function (error) { return (error === 'foo' ? Option_1.some(true) : Option_1.none); };
            var isOdd = function (n) { return n % 2 === 0; };
            it('initial', function () {
                expect(initialRD.recoverMap(f, isOdd)).toBe(initialRD);
            });
            it('pending', function () {
                expect(pendingRD.recoverMap(f, isOdd)).toBe(pendingRD);
            });
            it('failure', function () {
                expect(remote_data_1.failure('foo').recoverMap(f, isOdd)).toEqual(remote_data_1.success(true));
            });
            it('success', function () {
                expect(successRD.recoverMap(f, isOdd)).toEqual(remote_data_1.success(false));
            });
        });
    });
});
