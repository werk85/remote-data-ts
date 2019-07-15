"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var function_1 = require("fp-ts/lib/function");
var Option_1 = require("fp-ts/lib/Option");
var Either_1 = require("fp-ts/lib/Either");
var Array_1 = require("fp-ts/lib/Array");
var Ordering_1 = require("fp-ts/lib/Ordering");
var pipeable_1 = require("fp-ts/lib/pipeable");
exports.URI = 'RemoteData';
var concatPendings = function (a, b) {
    if (Option_1.isSome(a.progress) && Option_1.isSome(b.progress)) {
        var progressA = a.progress.value;
        var progressB = b.progress.value;
        if (Option_1.isNone(progressA.total) || Option_1.isNone(progressB.total)) {
            //tslint:disable no-use-before-declare
            return exports.progress({
                loaded: progressA.loaded + progressB.loaded,
                total: Option_1.none,
            });
            //tslint:enable no-use-before-declare
        }
        var totalA = progressA.total.value;
        var totalB = progressB.total.value;
        var total = totalA + totalB;
        var loaded = (progressA.loaded * totalA + progressB.loaded * totalB) / (total * total);
        //tslint:disable no-use-before-declare
        return exports.progress({
            loaded: loaded,
            total: Option_1.some(total),
        });
        //tslint:enable no-use-before-declare
    }
    var noA = Option_1.isNone(a.progress);
    var noB = Option_1.isNone(b.progress);
    if (noA && !noB) {
        return b;
    }
    if (!noA && noB) {
        return a;
    }
    return exports.pending; //tslint:disable-line no-use-before-declare
};
var RemoteInitial = /** @class */ (function () {
    function RemoteInitial() {
        this._tag = 'RemoteInitial';
    }
    /**
     * `alt` short for alternative, takes another `RemoteData`.
     * If `this` `RemoteData` is a `RemoteSuccess` type then it will be returned.
     * If it is a "Left" part then it will return the next `RemoteSuccess` if it exist.
     * If both are "Left" parts then it will return next "Left" part.
     *
     * For example:
     *
     * `sucess(1).alt(initial) will return success(1)`
     *
     * `pending.alt(success(2) will return success(2)`
     *
     * `failure(new Error('err text')).alt(pending) will return pending`
     */
    RemoteInitial.prototype.alt = function (fy) {
        return fy;
    };
    /**
     * Similar to `alt`, but lazy: it takes a function which returns `RemoteData` object.
     */
    RemoteInitial.prototype.altL = function (fy) {
        return fy();
    };
    /**
     * `ap`, short for "apply". Takes a function `fab` that is in the context of `RemoteData`,
     * and applies that function to this `RemoteData`'s value.
     * If the `RemoteData` calling `ap` is a "Left" part it will return same "Left" part.
     * If you pass a "Left" part to `ap` as an argument, it will return same "Left" part regardless on `RemoteData` which calls `ap`.
     *
     * For example:
     *
     * `success(1).ap(success(x => x + 1)) will return success(2)`.
     *
     * `success(1).ap(initial) will return initial`.
     *
     * `pending.ap(success(x => x+1)) will return pending`.
     *
     * `failure(new Error('err text')).ap(initial) will return failure.`
     */
    RemoteInitial.prototype.ap = function (fab) {
        return fab.isFailure() ? fab : exports.initial; //tslint:disable-line no-use-before-declare
    };
    /**
     * Takes a function `f` and returns a result of applying it to `RemoteData` value.
     * It's a bit like a `map`, but `f` should returns `RemoteData<T>` instead of `T` in `map`.
     * If this `RemoteData` is "Left" part, then it will return the same "Left" part.
     *
     * For example:
     *
     * `success(1).chain(x => success(x + 1)) will return success(2)`
     *
     * `success(2).chain(() => pending) will return pending`
     *
     * `initial.chain(x => success(x)) will return initial`
     */
    RemoteInitial.prototype.chain = function (f) {
        return exports.initial; //tslint:disable-line no-use-before-declare
    };
    RemoteInitial.prototype.bimap = function (f, g) {
        return exports.initial; //tslint:disable-line no-use-before-declare
    };
    /**
     * Takes a function `f` and returns a result of applying it to `RemoteData`.
     * It's a bit like a `chain`, but `f` should takes `RemoteData<T>` instead of returns it, and it should return T instead of takes it.
     */
    RemoteInitial.prototype.extend = function (f) {
        return exports.initial; //tslint:disable-line no-use-before-declare
    };
    /**
     * Needed for "unwrap" value from `RemoteData` "container".
     * It applies a function to each case in the data structure.
     *
     * For example:
     *
     * `const foldInitial = 'it's initial'
     * `const foldPending = 'it's pending'
     * `const foldFailure = (err) => 'it's failure'
     * `const foldSuccess = (data) => data + 1'
     *
     * `initial.fold(foldInitial, foldPending, foldFailure, foldSuccess) will return 'it's initial'`
     *
     * `pending.fold(foldInitial, foldPending, foldFailure, foldSuccess) will return 'it's pending'`
     *
     * `failure(new Error('error text')).fold(foldInitial, foldPending, foldFailure, foldSuccess) will return 'it's failure'`
     *
     * `success(21).fold(foldInitial, foldPending, foldFailure, foldSuccess) will return 22`
     */
    RemoteInitial.prototype.fold = function (onInitial, onPending, onFailure, onSuccess) {
        return onInitial;
    };
    /**
     * Same as `fold` but lazy: in `initial` and `pending` state it takes a function instead of value.
     *
     * For example:
     *
     * `const foldInitial = () => 'it's initial'
     * `const foldPending = () => 'it's pending'
     *
     * rest of example is similar to `fold`
     */
    RemoteInitial.prototype.foldL = function (onInitial, onPending, onFailure, onSuccess) {
        return onInitial();
    };
    /**
     * Same as `getOrElse` but lazy: it pass as an argument a function which returns a default value.
     *
     * For example:
     *
     * `some(1).getOrElse(() => 999) will return 1`
     *
     * `initial.getOrElseValue(() => 999) will return 999`
     */
    RemoteInitial.prototype.getOrElseL = function (f) {
        return f();
    };
    /**
     * Takes a function `f`.
     * If it maps on `RemoteSuccess` then it will apply a function to `RemoteData`'s value
     * If it maps on "Left" part then it will return the same "Left" part.
     *
     * For example:
     *
     * `success(1).map(x => x + 99) will return success(100)`
     *
     * `initial.map(x => x + 99) will return initial`
     *
     * `pending.map(x => x + 99) will return pending`
     *
     * `failure(new Error('error text')).map(x => x + 99) will return failure(new Error('error text')`
     */
    RemoteInitial.prototype.map = function (f) {
        return exports.initial; //tslint:disable-line no-use-before-declare
    };
    /**
     * Similar to `map`, but it only map a `RemoteFailure` ("Left" part where we have some data, so we can map it).
     *
     * For example:
     *
     * `success(1).map(x => 'new error text') will return success(1)`
     *
     * `initial.map(x => 'new error text') will return initial`
     *
     * `failure(new Error('error text')).map(x => 'new error text') will return failure(new Error('new error text'))`
     */
    RemoteInitial.prototype.mapLeft = function (f) {
        return exports.initial; //tslint:disable-line no-use-before-declare
    };
    /**
     * Takes a default value as an argument.
     * If this `RemoteData` is "Left" part it will return default value.
     * If this `RemoteData` is `RemoteSuccess` it will return it's value ("wrapped" value, not default value)
     *
     * Note: Default value should be the same type as `RemoteData` (internal) value, if you want to pass different type as default, use `fold` or `foldL`.
     *
     * For example:
     *
     * `some(1).getOrElse(999) will return 1`
     *
     * `initial.getOrElseValue(999) will return 999`
     *
     */
    RemoteInitial.prototype.getOrElse = function (value) {
        return value;
    };
    RemoteInitial.prototype.reduce = function (f, b) {
        return b;
    };
    /**
     * Returns true only if `RemoteData` is `RemoteInitial`.
     *
     */
    RemoteInitial.prototype.isInitial = function () {
        return true;
    };
    /**
     * Returns true only if `RemoteData` is `RemotePending`.
     *
     */
    RemoteInitial.prototype.isPending = function () {
        return false;
    };
    /**
     * Returns true only if `RemoteData` is `RemoteFailure`.
     *
     */
    RemoteInitial.prototype.isFailure = function () {
        return false;
    };
    /**
     * Returns true only if `RemoteData` is `RemoteSuccess`.
     *
     */
    RemoteInitial.prototype.isSuccess = function () {
        return false;
    };
    /**
     * Convert `RemoteData` to `Option`.
     * "Left" part will be converted to `None`.
     * `RemoteSuccess` will be converted to `Some`.
     *
     * For example:
     *
     * `success(2).toOption() will return some(2)`
     *
     * `initial.toOption() will return none`
     *
     * `pending.toOption() will return none`
     *
     * `failure(new Error('error text')).toOption() will return none`
     */
    RemoteInitial.prototype.toOption = function () {
        return Option_1.none;
    };
    /**
     * Convert `RemoteData` to `Either`.
     * "Left" part will be converted to `Left<L>`.
     * Since `RemoteInitial` and `RemotePending` do not have `L` values,
     * you must provide a value of type `L` that will be used to construct
     * the `Left<L>` for those two cases.
     * `RemoteSuccess` will be converted to `Right<R>`.
     *
     * For example:
     *
     * `const iError = new Error('Data not fetched')`
     * `const pError = new Error('Data is fetching')`
     *
     * `success(2).toEither(iError, pError) will return right(2)`
     *
     * `initial.toEither(iError, pError) will return right(Error('Data not fetched'))`
     *
     * `pending.toEither(iError, pError) will return right(Error('Data is fetching'))`
     *
     * `failure(new Error('error text')).toEither(iError, pError) will return right(Error('error text'))`
     */
    RemoteInitial.prototype.toEither = function (onInitial, onPending) {
        return Either_1.left(onInitial);
    };
    /**
     * Like `toEither`, but lazy: it takes functions that return an `L` value
     * as arguments instead of an `L` value.
     *
     * For example:
     *
     * `const iError = () => new Error('Data not fetched')`
     * `const pError = () => new Error('Data is fetching')`
     *
     * `initial.toEither(iError, pError) will return right(Error('Data not fetched'))`
     *
     * `pending.toEither(iError, pError) will return right(Error('Data is fetching'))`
     */
    RemoteInitial.prototype.toEitherL = function (onInitial, onPending) {
        return Either_1.left(onInitial());
    };
    /**
     * One more way to fold (unwrap) value from `RemoteData`.
     * "Left" part will return `null`.
     * `RemoteSuccess` will return value.
     *
     * For example:
     *
     * `success(2).toNullable() will return 2`
     *
     * `initial.toNullable() will return null`
     *
     * `pending.toNullable() will return null`
     *
     * `failure(new Error('error text)).toNullable() will return null`
     *
     */
    RemoteInitial.prototype.toNullable = function () {
        return null;
    };
    /**
     * Returns string representation of `RemoteData`.
     */
    RemoteInitial.prototype.toString = function () {
        return 'initial';
    };
    /**
     * Compare values and returns `true` if they are identical, otherwise returns `false`.
     * "Left" part will return `false`.
     * `RemoteSuccess` will call `Eq`'s `equals` method.
     *
     * If you want to compare `RemoteData`'s values better use `getEq` or `getOrd` helpers.
     *
     */
    RemoteInitial.prototype.contains = function (S, a) {
        return false;
    };
    /**
     * Takes a predicate and apply it to `RemoteSuccess` value.
     * "Left" part will return `false`.
     */
    RemoteInitial.prototype.exists = function (p) {
        return false;
    };
    /**
     * Maps this RemoteFailure error into RemoteSuccess if passed function f return {@link Some} value, otherwise returns self
     */
    RemoteInitial.prototype.recover = function (f) {
        return this;
    };
    /**
     * Recovers this RemoteFailure also mapping RemoteSuccess case
     * @see {@link recover}
     */
    RemoteInitial.prototype.recoverMap = function (f, g) {
        return this;
    };
    return RemoteInitial;
}());
exports.RemoteInitial = RemoteInitial;
var RemoteFailure = /** @class */ (function () {
    function RemoteFailure(error) {
        this.error = error;
        this._tag = 'RemoteFailure';
    }
    RemoteFailure.prototype.alt = function (fy) {
        return fy;
    };
    RemoteFailure.prototype.altL = function (fy) {
        return fy();
    };
    RemoteFailure.prototype.ap = function (fab) {
        //tslint:disable-next-line no-use-before-declare
        return fab.isFailure() ? fab : this;
    };
    RemoteFailure.prototype.chain = function (f) {
        return this;
    };
    RemoteFailure.prototype.bimap = function (f, g) {
        return exports.failure(f(this.error)); //tslint:disable-line no-use-before-declare
    };
    RemoteFailure.prototype.extend = function (f) {
        return this;
    };
    RemoteFailure.prototype.fold = function (onInitial, onPending, onFailure, onSuccess) {
        return onFailure(this.error);
    };
    RemoteFailure.prototype.foldL = function (onInitial, onPending, onFailure, onSuccess) {
        return onFailure(this.error);
    };
    RemoteFailure.prototype.getOrElseL = function (f) {
        return f();
    };
    RemoteFailure.prototype.map = function (f) {
        return this;
    };
    RemoteFailure.prototype.mapLeft = function (f) {
        return exports.failure(f(this.error)); //tslint:disable-line no-use-before-declare
    };
    RemoteFailure.prototype.getOrElse = function (value) {
        return value;
    };
    RemoteFailure.prototype.reduce = function (f, b) {
        return b;
    };
    RemoteFailure.prototype.isInitial = function () {
        return false;
    };
    RemoteFailure.prototype.isPending = function () {
        return false;
    };
    RemoteFailure.prototype.isFailure = function () {
        return true;
    };
    RemoteFailure.prototype.isSuccess = function () {
        return false;
    };
    RemoteFailure.prototype.toOption = function () {
        return Option_1.none;
    };
    RemoteFailure.prototype.toEither = function (onInitial, onPending) {
        return Either_1.left(this.error);
    };
    RemoteFailure.prototype.toEitherL = function (onInitial, onPending) {
        return Either_1.left(this.error);
    };
    RemoteFailure.prototype.toNullable = function () {
        return null;
    };
    RemoteFailure.prototype.toString = function () {
        return "failure(" + String(this.error) + ")";
    };
    RemoteFailure.prototype.contains = function (S, a) {
        return false;
    };
    RemoteFailure.prototype.exists = function (p) {
        return false;
    };
    RemoteFailure.prototype.recover = function (f) {
        return this.recoverMap(f, function_1.identity);
    };
    RemoteFailure.prototype.recoverMap = function (f, g) {
        var _this = this;
        return pipeable_1.pipe(f(this.error), Option_1.fold(function () { return _this; }, exports.success));
    };
    return RemoteFailure;
}());
exports.RemoteFailure = RemoteFailure;
var RemoteSuccess = /** @class */ (function () {
    function RemoteSuccess(value) {
        this.value = value;
        this._tag = 'RemoteSuccess';
    }
    RemoteSuccess.prototype.alt = function (fy) {
        return this;
    };
    RemoteSuccess.prototype.altL = function (fy) {
        return this;
    };
    RemoteSuccess.prototype.ap = function (fab) {
        var _this = this;
        return fab.fold(exports.initial, //tslint:disable-line no-use-before-declare
        fab, function () { return fab; }, function (value) { return _this.map(value); });
    };
    RemoteSuccess.prototype.chain = function (f) {
        return f(this.value);
    };
    RemoteSuccess.prototype.bimap = function (f, g) {
        return exports.success(g(this.value)); //tslint:disable-line no-use-before-declare
    };
    RemoteSuccess.prototype.extend = function (f) {
        return exports.remoteData.of(f(this)); //tslint:disable-line no-use-before-declare
    };
    RemoteSuccess.prototype.fold = function (onInitial, onPending, onFailure, onSuccess) {
        return onSuccess(this.value);
    };
    RemoteSuccess.prototype.foldL = function (onInitial, onPending, onFailure, onSuccess) {
        return onSuccess(this.value);
    };
    RemoteSuccess.prototype.getOrElseL = function (f) {
        return this.value;
    };
    RemoteSuccess.prototype.map = function (f) {
        return exports.remoteData.of(f(this.value)); //tslint:disable-line no-use-before-declare
    };
    RemoteSuccess.prototype.mapLeft = function (f) {
        return this;
    };
    RemoteSuccess.prototype.getOrElse = function (value) {
        return this.value;
    };
    RemoteSuccess.prototype.reduce = function (f, b) {
        return f(b, this.value);
    };
    RemoteSuccess.prototype.isInitial = function () {
        return false;
    };
    RemoteSuccess.prototype.isPending = function () {
        return false;
    };
    RemoteSuccess.prototype.isFailure = function () {
        return false;
    };
    RemoteSuccess.prototype.isSuccess = function () {
        return true;
    };
    RemoteSuccess.prototype.toOption = function () {
        return Option_1.some(this.value);
    };
    RemoteSuccess.prototype.toEither = function (onInitial, onPending) {
        return Either_1.right(this.value);
    };
    RemoteSuccess.prototype.toEitherL = function (onInitial, onPending) {
        return Either_1.right(this.value);
    };
    RemoteSuccess.prototype.toNullable = function () {
        return this.value;
    };
    RemoteSuccess.prototype.toString = function () {
        return "success(" + String(this.value) + ")";
    };
    RemoteSuccess.prototype.contains = function (S, a) {
        return S.equals(this.value, a);
    };
    RemoteSuccess.prototype.exists = function (p) {
        return p(this.value);
    };
    RemoteSuccess.prototype.recover = function (f) {
        return this;
    };
    RemoteSuccess.prototype.recoverMap = function (f, g) {
        return this.map(g);
    };
    return RemoteSuccess;
}());
exports.RemoteSuccess = RemoteSuccess;
var RemotePending = /** @class */ (function () {
    function RemotePending(progress) {
        if (progress === void 0) { progress = Option_1.none; }
        this.progress = progress;
        this._tag = 'RemotePending';
    }
    RemotePending.prototype.alt = function (fy) {
        return fy;
    };
    RemotePending.prototype.altL = function (fy) {
        return fy();
    };
    RemotePending.prototype.ap = function (fab) {
        var _this = this;
        return fab.fold(exports.initial, //tslint:disable-line no-use-before-declare
        fab.isPending()
            ? concatPendings(this, fab)
            : this, function () { return fab; }, function () { return _this; });
    };
    RemotePending.prototype.chain = function (f) {
        return exports.pending; //tslint:disable-line no-use-before-declare
    };
    RemotePending.prototype.bimap = function (f, g) {
        return exports.pending; //tslint:disable-line no-use-before-declare
    };
    RemotePending.prototype.extend = function (f) {
        return exports.pending; //tslint:disable-line no-use-before-declare
    };
    RemotePending.prototype.fold = function (onInitial, onPending, onFailure, onSuccess) {
        return onPending;
    };
    RemotePending.prototype.foldL = function (onInitial, onPending, onFailure, onSuccess) {
        return onPending(this.progress);
    };
    RemotePending.prototype.getOrElseL = function (f) {
        return f();
    };
    RemotePending.prototype.map = function (f) {
        return this;
    };
    RemotePending.prototype.mapLeft = function (f) {
        return exports.pending; //tslint:disable-line no-use-before-declare
    };
    RemotePending.prototype.getOrElse = function (value) {
        return value;
    };
    RemotePending.prototype.reduce = function (f, b) {
        return b;
    };
    RemotePending.prototype.isInitial = function () {
        return false;
    };
    RemotePending.prototype.isPending = function () {
        return true;
    };
    RemotePending.prototype.isFailure = function () {
        return false;
    };
    RemotePending.prototype.isSuccess = function () {
        return false;
    };
    RemotePending.prototype.toOption = function () {
        return Option_1.none;
    };
    RemotePending.prototype.toEither = function (onInitial, onPending) {
        return Either_1.left(onPending);
    };
    RemotePending.prototype.toEitherL = function (onInitial, onPending) {
        return Either_1.left(onPending());
    };
    RemotePending.prototype.toNullable = function () {
        return null;
    };
    RemotePending.prototype.toString = function () {
        return 'pending';
    };
    RemotePending.prototype.contains = function (S, a) {
        return false;
    };
    RemotePending.prototype.exists = function (p) {
        return false;
    };
    RemotePending.prototype.recover = function (f) {
        return this;
    };
    RemotePending.prototype.recoverMap = function (f, g) {
        return this;
    };
    return RemotePending;
}());
exports.RemotePending = RemotePending;
//constructors
exports.failure = function (error) { return new RemoteFailure(error); };
exports.success = function (value) { return new RemoteSuccess(value); };
exports.pending = new RemotePending();
exports.progress = function (progress) { return new RemotePending(Option_1.some(progress)); };
exports.initial = new RemoteInitial();
//filters
exports.isFailure = function (data) { return data.isFailure(); };
exports.isSuccess = function (data) { return data.isSuccess(); };
exports.isPending = function (data) { return data.isPending(); };
exports.isInitial = function (data) { return data.isInitial(); };
exports.getOrElse = function (f) { return function (ma) { return (exports.isSuccess(ma) ? ma.value : f()); }; };
exports.fold = function (onInitial, onPending, onFailure, onSuccess) { return function (ma) {
    return exports.isInitial(ma)
        ? onInitial()
        : exports.isPending(ma)
            ? onPending(ma.progress)
            : exports.isFailure(ma)
                ? onFailure(ma.error)
                : onSuccess(ma.value);
}; };
exports.toNullable = function (ma) { return (exports.isSuccess(ma) ? ma.value : null); };
exports.toUndefined = function (ma) { return (exports.isSuccess(ma) ? ma.value : undefined); };
//Eq
exports.getEq = function (SL, SA) {
    return {
        equals: function (x, y) {
            return x.foldL(function () { return y.isInitial(); }, function () { return y.isPending(); }, function (xError) { return y.foldL(function_1.constFalse, function_1.constFalse, function (yError) { return SL.equals(xError, yError); }, function_1.constFalse); }, function (ax) { return y.foldL(function_1.constFalse, function_1.constFalse, function_1.constFalse, function (ay) { return SA.equals(ax, ay); }); });
        },
    };
};
//Ord
exports.getOrd = function (OL, OA) {
    return tslib_1.__assign({}, exports.getEq(OL, OA), { compare: function (x, y) {
            return Ordering_1.sign(x.foldL(function () { return y.fold(0, -1, function () { return -1; }, function () { return -1; }); }, function () { return y.fold(1, 0, function () { return -1; }, function () { return -1; }); }, function (xError) { return y.fold(1, 1, function (yError) { return OL.compare(xError, yError); }, function () { return -1; }); }, function (xValue) { return y.fold(1, 1, function () { return 1; }, function (yValue) { return OA.compare(xValue, yValue); }); }));
        } });
};
//Semigroup
exports.getSemigroup = function (SL, SA) {
    return {
        concat: function (x, y) {
            return x.foldL(function () { return y.fold(y, y, function () { return y; }, function () { return y; }); }, function () {
                return y.foldL(function () { return x; }, function () { return concatPendings(x, y); }, function () { return y; }, function () { return y; });
            }, function (xError) { return y.fold(x, x, function (yError) { return exports.failure(SL.concat(xError, yError)); }, function () { return y; }); }, function (xValue) { return y.fold(x, x, function () { return x; }, function (yValue) { return exports.success(SA.concat(xValue, yValue)); }); });
        },
    };
};
//Monoid
exports.getMonoid = function (SL, SA) {
    return tslib_1.__assign({}, exports.getSemigroup(SL, SA), { empty: exports.initial });
};
function fromOption(option, error) {
    if (Option_1.isNone(option)) {
        return exports.failure(error());
    }
    else {
        return exports.success(option.value);
    }
}
exports.fromOption = fromOption;
function fromEither(either) {
    return pipeable_1.pipe(either, Either_1.fold(function (l) { return exports.failure(l); }, function (r) { return exports.success(r); }));
}
exports.fromEither = fromEither;
function fromPredicate(predicate, whenFalse) {
    return function (a) { return (predicate(a) ? exports.success(a) : exports.failure(whenFalse(a))); };
}
exports.fromPredicate = fromPredicate;
function fromProgressEvent(event) {
    return exports.progress({
        loaded: event.loaded,
        total: event.lengthComputable ? Option_1.some(event.total) : Option_1.none,
    });
}
exports.fromProgressEvent = fromProgressEvent;
//instance
exports.remoteData = {
    //HKT
    URI: exports.URI,
    //Monad
    of: function (value) { return new RemoteSuccess(value); },
    ap: function (fab, fa) { return fa.ap(fab); },
    map: function (fa, f) { return fa.map(f); },
    chain: function (fa, f) { return fa.chain(f); },
    //Foldable
    reduce: function (fa, b, f) { return fa.reduce(f, b); },
    reduceRight: function (fa, b, f) {
        return fa.isSuccess() ? f(fa.value, b) : b;
    },
    foldMap: function (M) { return function (fa, f) {
        return fa.isSuccess() ? f(fa.value) : M.empty;
    }; },
    //Traversable
    traverse: function (F) { return function (ta, f) {
        if (ta.isSuccess()) {
            return F.map(f(ta.value), exports.remoteData.of);
        }
        else {
            return F.of(ta);
        }
    }; },
    sequence: function (F) { return function (ta) {
        return exports.remoteData.traverse(F)(ta, function_1.identity);
    }; },
    //Bifunctor
    bimap: function (fla, f, g) { return fla.bimap(f, g); },
    mapLeft: function (fla, f) { return fla.mapLeft(f); },
    //Alt
    alt: function (fx, fy) { return fx.alt(fy()); },
    //Alternative
    zero: function () { return exports.initial; },
    //Extend
    extend: function (fla, f) { return fla.extend(f); },
};
var _a = pipeable_1.pipeable(exports.remoteData), alt = _a.alt, ap = _a.ap, apFirst = _a.apFirst, apSecond = _a.apSecond, bimap = _a.bimap, chain = _a.chain, chainFirst = _a.chainFirst, duplicate = _a.duplicate, extend = _a.extend, flatten = _a.flatten, foldMap = _a.foldMap, map = _a.map, mapLeft = _a.mapLeft, reduce = _a.reduce, reduceRight = _a.reduceRight;
exports.alt = alt;
exports.ap = ap;
exports.apFirst = apFirst;
exports.apSecond = apSecond;
exports.bimap = bimap;
exports.chain = chain;
exports.chainFirst = chainFirst;
exports.duplicate = duplicate;
exports.extend = extend;
exports.flatten = flatten;
exports.foldMap = foldMap;
exports.map = map;
exports.mapLeft = mapLeft;
exports.reduce = reduce;
exports.reduceRight = reduceRight;
function combine() {
    var list = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        list[_i] = arguments[_i];
    }
    if (list.length === 0) {
        return exports.remoteData.of([]);
    }
    return Array_1.array.sequence(exports.remoteData)(list);
}
exports.combine = combine;
