import { FunctionN, Lazy, Predicate } from 'fp-ts/lib/function';
import { Monad2 } from 'fp-ts/lib/Monad';
import { Foldable2 } from 'fp-ts/lib/Foldable';
import { Alt2 } from 'fp-ts/lib/Alt';
import { Extend2 } from 'fp-ts/lib/Extend';
import { Traversable2 } from 'fp-ts/lib/Traversable';
import { Bifunctor2 } from 'fp-ts/lib/Bifunctor';
import { Option } from 'fp-ts/lib/Option';
import { Either } from 'fp-ts/lib/Either';
import { Eq } from 'fp-ts/lib/Eq';
import { Alternative2 } from 'fp-ts/lib/Alternative';
import { Ord } from 'fp-ts/lib/Ord';
import { Semigroup } from 'fp-ts/lib/Semigroup';
import { Monoid } from 'fp-ts/lib/Monoid';
export declare const URI = "RemoteData";
export declare type URI = typeof URI;
declare module 'fp-ts/lib/HKT' {
    interface URItoKind2<E, A> {
        RemoteData: RemoteData<E, A>;
    }
}
export declare type RemoteProgress = {
    loaded: number;
    total: Option<number>;
};
export declare class RemoteInitial<L, A> {
    readonly _tag: 'RemoteInitial';
    readonly '_URI': URI;
    readonly '_A': A;
    readonly '_L': L;
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
    alt(fy: RemoteData<L, A>): RemoteData<L, A>;
    /**
     * Similar to `alt`, but lazy: it takes a function which returns `RemoteData` object.
     */
    altL(fy: Lazy<RemoteData<L, A>>): RemoteData<L, A>;
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
    ap<B>(fab: RemoteData<L, FunctionN<[A], B>>): RemoteData<L, B>;
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
    chain<B>(f: FunctionN<[A], RemoteData<L, B>>): RemoteData<L, B>;
    bimap<V, B>(f: (l: L) => V, g: (a: A) => B): RemoteData<V, B>;
    /**
     * Takes a function `f` and returns a result of applying it to `RemoteData`.
     * It's a bit like a `chain`, but `f` should takes `RemoteData<T>` instead of returns it, and it should return T instead of takes it.
     */
    extend<B>(f: FunctionN<[RemoteData<L, A>], B>): RemoteData<L, B>;
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
    fold<B>(onInitial: B, onPending: B, onFailure: FunctionN<[L], B>, onSuccess: FunctionN<[A], B>): B;
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
    foldL<B>(onInitial: Lazy<B>, onPending: FunctionN<[Option<RemoteProgress>], B>, onFailure: FunctionN<[L], B>, onSuccess: FunctionN<[A], B>): B;
    /**
     * Same as `getOrElse` but lazy: it pass as an argument a function which returns a default value.
     *
     * For example:
     *
     * `some(1).getOrElse(() => 999) will return 1`
     *
     * `initial.getOrElseValue(() => 999) will return 999`
     */
    getOrElseL(f: Lazy<A>): A;
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
    map<B>(f: FunctionN<[A], B>): RemoteData<L, B>;
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
    mapLeft<M>(f: FunctionN<[L], M>): RemoteData<M, A>;
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
    getOrElse(value: A): A;
    reduce<B>(f: FunctionN<[B, A], B>, b: B): B;
    /**
     * Returns true only if `RemoteData` is `RemoteInitial`.
     *
     */
    isInitial(): this is RemoteInitial<L, A>;
    /**
     * Returns true only if `RemoteData` is `RemotePending`.
     *
     */
    isPending(): this is RemotePending<L, A>;
    /**
     * Returns true only if `RemoteData` is `RemoteFailure`.
     *
     */
    isFailure(): this is RemoteFailure<L, A>;
    /**
     * Returns true only if `RemoteData` is `RemoteSuccess`.
     *
     */
    isSuccess(): this is RemoteSuccess<L, A>;
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
    toOption(): Option<A>;
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
    toEither(onInitial: L, onPending: L): Either<L, A>;
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
    toEitherL(onInitial: Lazy<L>, onPending: Lazy<L>): Either<L, A>;
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
    toNullable(): A | null;
    /**
     * Returns string representation of `RemoteData`.
     */
    toString(): string;
    /**
     * Compare values and returns `true` if they are identical, otherwise returns `false`.
     * "Left" part will return `false`.
     * `RemoteSuccess` will call `Eq`'s `equals` method.
     *
     * If you want to compare `RemoteData`'s values better use `getEq` or `getOrd` helpers.
     *
     */
    contains(S: Eq<A>, a: A): boolean;
    /**
     * Takes a predicate and apply it to `RemoteSuccess` value.
     * "Left" part will return `false`.
     */
    exists(p: Predicate<A>): boolean;
    /**
     * Maps this RemoteFailure error into RemoteSuccess if passed function f return {@link Some} value, otherwise returns self
     */
    recover(f: (error: L) => Option<A>): RemoteData<L, A>;
    /**
     * Recovers this RemoteFailure also mapping RemoteSuccess case
     * @see {@link recover}
     */
    recoverMap<B>(f: (error: L) => Option<B>, g: (value: A) => B): RemoteData<L, B>;
}
export declare class RemoteFailure<L, A> {
    readonly error: L;
    readonly _tag: 'RemoteFailure';
    readonly '_URI': URI;
    readonly '_A': A;
    readonly '_L': L;
    constructor(error: L);
    alt(fy: RemoteData<L, A>): RemoteData<L, A>;
    altL(fy: Lazy<RemoteData<L, A>>): RemoteData<L, A>;
    ap<B>(fab: RemoteData<L, FunctionN<[A], B>>): RemoteData<L, B>;
    chain<B>(f: FunctionN<[A], RemoteData<L, B>>): RemoteData<L, B>;
    bimap<V, B>(f: (l: L) => V, g: (a: A) => B): RemoteData<V, B>;
    extend<B>(f: FunctionN<[RemoteData<L, A>], B>): RemoteData<L, B>;
    fold<B>(onInitial: B, onPending: B, onFailure: FunctionN<[L], B>, onSuccess: FunctionN<[A], B>): B;
    foldL<B>(onInitial: Lazy<B>, onPending: FunctionN<[Option<RemoteProgress>], B>, onFailure: FunctionN<[L], B>, onSuccess: FunctionN<[A], B>): B;
    getOrElseL(f: Lazy<A>): A;
    map<B>(f: (a: A) => B): RemoteData<L, B>;
    mapLeft<M>(f: FunctionN<[L], M>): RemoteData<M, A>;
    getOrElse(value: A): A;
    reduce<B>(f: FunctionN<[B, A], B>, b: B): B;
    isInitial(): this is RemoteInitial<L, A>;
    isPending(): this is RemotePending<L, A>;
    isFailure(): this is RemoteFailure<L, A>;
    isSuccess(): this is RemoteSuccess<L, A>;
    toOption(): Option<A>;
    toEither(onInitial: L, onPending: L): Either<L, A>;
    toEitherL(onInitial: Lazy<L>, onPending: Lazy<L>): Either<L, A>;
    toNullable(): A | null;
    toString(): string;
    contains(S: Eq<A>, a: A): boolean;
    exists(p: Predicate<A>): boolean;
    recover(f: (error: L) => Option<A>): RemoteData<L, A>;
    recoverMap<B>(f: (error: L) => Option<B>, g: (value: A) => B): RemoteData<L, B>;
}
export declare class RemoteSuccess<L, A> {
    readonly value: A;
    readonly _tag: 'RemoteSuccess';
    readonly '_URI': URI;
    readonly '_A': A;
    readonly '_L': L;
    constructor(value: A);
    alt(fy: RemoteData<L, A>): RemoteData<L, A>;
    altL(fy: Lazy<RemoteData<L, A>>): RemoteData<L, A>;
    ap<B>(fab: RemoteData<L, FunctionN<[A], B>>): RemoteData<L, B>;
    chain<B>(f: FunctionN<[A], RemoteData<L, B>>): RemoteData<L, B>;
    bimap<V, B>(f: (l: L) => V, g: (a: A) => B): RemoteData<V, B>;
    extend<B>(f: FunctionN<[RemoteData<L, A>], B>): RemoteData<L, B>;
    fold<B>(onInitial: B, onPending: B, onFailure: FunctionN<[L], B>, onSuccess: FunctionN<[A], B>): B;
    foldL<B>(onInitial: Lazy<B>, onPending: FunctionN<[Option<RemoteProgress>], B>, onFailure: FunctionN<[L], B>, onSuccess: FunctionN<[A], B>): B;
    getOrElseL(f: Lazy<A>): A;
    map<B>(f: FunctionN<[A], B>): RemoteData<L, B>;
    mapLeft<M>(f: FunctionN<[L], M>): RemoteData<M, A>;
    getOrElse(value: A): A;
    reduce<B>(f: FunctionN<[B, A], B>, b: B): B;
    isInitial(): this is RemoteInitial<L, A>;
    isPending(): this is RemotePending<L, A>;
    isFailure(): this is RemoteFailure<L, A>;
    isSuccess(): this is RemoteSuccess<L, A>;
    toOption(): Option<A>;
    toEither(onInitial: L, onPending: L): Either<L, A>;
    toEitherL(onInitial: Lazy<L>, onPending: Lazy<L>): Either<L, A>;
    toNullable(): A | null;
    toString(): string;
    contains(S: Eq<A>, a: A): boolean;
    exists(p: Predicate<A>): boolean;
    recover(f: (error: L) => Option<A>): RemoteData<L, A>;
    recoverMap<B>(f: (error: L) => Option<B>, g: (value: A) => B): RemoteData<L, B>;
}
export declare class RemotePending<L, A> {
    readonly progress: Option<RemoteProgress>;
    readonly _tag: 'RemotePending';
    readonly '_URI': URI;
    readonly '_A': A;
    readonly '_L': L;
    constructor(progress?: Option<RemoteProgress>);
    alt(fy: RemoteData<L, A>): RemoteData<L, A>;
    altL(fy: Lazy<RemoteData<L, A>>): RemoteData<L, A>;
    ap<B>(fab: RemoteData<L, FunctionN<[A], B>>): RemoteData<L, B>;
    chain<B>(f: FunctionN<[A], RemoteData<L, B>>): RemoteData<L, B>;
    bimap<V, B>(f: (l: L) => V, g: (a: A) => B): RemoteData<V, B>;
    extend<B>(f: FunctionN<[RemoteData<L, A>], B>): RemoteData<L, B>;
    fold<B>(onInitial: B, onPending: B, onFailure: FunctionN<[L], B>, onSuccess: FunctionN<[A], B>): B;
    foldL<B>(onInitial: Lazy<B>, onPending: FunctionN<[Option<RemoteProgress>], B>, onFailure: FunctionN<[L], B>, onSuccess: FunctionN<[A], B>): B;
    getOrElseL(f: Lazy<A>): A;
    map<B>(f: FunctionN<[A], B>): RemoteData<L, B>;
    mapLeft<M>(f: FunctionN<[L], M>): RemoteData<M, A>;
    getOrElse(value: A): A;
    reduce<B>(f: FunctionN<[B, A], B>, b: B): B;
    isInitial(): this is RemoteInitial<L, A>;
    isPending(): this is RemotePending<L, A>;
    isFailure(): this is RemoteFailure<L, A>;
    isSuccess(): this is RemoteSuccess<L, A>;
    toOption(): Option<A>;
    toEither(onInitial: L, onPending: L): Either<L, A>;
    toEitherL(onInitial: Lazy<L>, onPending: Lazy<L>): Either<L, A>;
    toNullable(): A | null;
    toString(): string;
    contains(S: Eq<A>, a: A): boolean;
    exists(p: Predicate<A>): boolean;
    recover(f: (error: L) => Option<A>): RemoteData<L, A>;
    recoverMap<B>(f: (error: L) => Option<B>, g: (value: A) => B): RemoteData<L, B>;
}
/**
 * Represents a value of one of four possible types (a disjoint union)
 *
 * An instance of `RemoteData` is either an instance of `RemoteInitial`, `RemotePending`, `RemoteFailure` or `RemoteSuccess`
 *
 * A common use of `RemoteData` is as an alternative to `Either` or `Option` supporting initial and pending states (fits best with [RXJS]{@link https://github.com/ReactiveX/rxjs/}).
 *
 * Note: `RemoteInitial`, `RemotePending` and `RemoteFailure` are commonly called "Left" part in jsDoc.
 *
 * @see https://medium.com/@gcanti/slaying-a-ui-antipattern-with-flow-5eed0cfb627b
 *
 */
export declare type RemoteData<L, A> = RemoteInitial<L, A> | RemoteFailure<L, A> | RemoteSuccess<L, A> | RemotePending<L, A>;
export declare const failure: <L, A>(error: L) => RemoteData<L, A>;
export declare const success: <L, A>(value: A) => RemoteData<L, A>;
export declare const pending: RemoteData<never, never>;
export declare const progress: <L, A>(progress: RemoteProgress) => RemoteData<L, A>;
export declare const initial: RemoteData<never, never>;
export declare const isFailure: <L, A>(data: RemoteData<L, A>) => data is RemoteFailure<L, A>;
export declare const isSuccess: <L, A>(data: RemoteData<L, A>) => data is RemoteSuccess<L, A>;
export declare const isPending: <L, A>(data: RemoteData<L, A>) => data is RemotePending<L, A>;
export declare const isInitial: <L, A>(data: RemoteData<L, A>) => data is RemoteInitial<L, A>;
export declare const getOrElse: <L, A>(f: Lazy<A>) => (ma: RemoteData<L, A>) => A;
export declare const fold: <L, A, B>(onInitial: Lazy<B>, onPending: FunctionN<[Option<RemoteProgress>], B>, onFailure: FunctionN<[L], B>, onSuccess: FunctionN<[A], B>) => (ma: RemoteData<L, A>) => B;
export declare const toNullable: <L, A>(ma: RemoteData<L, A>) => A | null;
export declare const toUndefined: <L, A>(ma: RemoteData<L, A>) => A | undefined;
export declare const getEq: <L, A>(SL: Eq<L>, SA: Eq<A>) => Eq<RemoteData<L, A>>;
export declare const getOrd: <L, A>(OL: Ord<L>, OA: Ord<A>) => Ord<RemoteData<L, A>>;
export declare const getSemigroup: <L, A>(SL: Semigroup<L>, SA: Semigroup<A>) => Semigroup<RemoteData<L, A>>;
export declare const getMonoid: <L, A>(SL: Semigroup<L>, SA: Semigroup<A>) => Monoid<RemoteData<L, A>>;
export declare function fromOption<L, A>(option: Option<A>, error: Lazy<L>): RemoteData<L, A>;
export declare function fromEither<L, A>(either: Either<L, A>): RemoteData<L, A>;
export declare function fromPredicate<L, A>(predicate: Predicate<A>, whenFalse: FunctionN<[A], L>): FunctionN<[A], RemoteData<L, A>>;
export declare function fromProgressEvent<L, A>(event: ProgressEvent): RemoteData<L, A>;
export declare const remoteData: Monad2<URI> & Foldable2<URI> & Traversable2<URI> & Bifunctor2<URI> & Alt2<URI> & Extend2<URI> & Alternative2<URI>;
declare const alt: <E, A>(that: () => RemoteData<E, A>) => (fa: RemoteData<E, A>) => RemoteData<E, A>, ap: <E, A>(fa: RemoteData<E, A>) => <B>(fab: RemoteData<E, (a: A) => B>) => RemoteData<E, B>, apFirst: <E, B>(fb: RemoteData<E, B>) => <A>(fa: RemoteData<E, A>) => RemoteData<E, A>, apSecond: <E, B>(fb: RemoteData<E, B>) => <A>(fa: RemoteData<E, A>) => RemoteData<E, B>, bimap: <E, G, A, B>(f: (e: E) => G, g: (a: A) => B) => (fa: RemoteData<E, A>) => RemoteData<G, B>, chain: <E, A, B>(f: (a: A) => RemoteData<E, B>) => (ma: RemoteData<E, A>) => RemoteData<E, B>, chainFirst: <E, A, B>(f: (a: A) => RemoteData<E, B>) => (ma: RemoteData<E, A>) => RemoteData<E, A>, duplicate: <E, A>(ma: RemoteData<E, A>) => RemoteData<E, RemoteData<E, A>>, extend: <E, A, B>(f: (fa: RemoteData<E, A>) => B) => (ma: RemoteData<E, A>) => RemoteData<E, B>, flatten: <E, A>(mma: RemoteData<E, RemoteData<E, A>>) => RemoteData<E, A>, foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => <E>(fa: RemoteData<E, A>) => M, map: <A, B>(f: (a: A) => B) => <E>(fa: RemoteData<E, A>) => RemoteData<E, B>, mapLeft: <E, G>(f: (e: E) => G) => <A>(fa: RemoteData<E, A>) => RemoteData<G, A>, reduce: <A, B>(b: B, f: (b: B, a: A) => B) => <E>(fa: RemoteData<E, A>) => B, reduceRight: <A, B>(b: B, f: (a: A, b: B) => B) => <E>(fa: RemoteData<E, A>) => B;
export { alt, ap, apFirst, apSecond, bimap, chain, chainFirst, duplicate, extend, flatten, foldMap, map, mapLeft, reduce, reduceRight, };
export declare function combine<A, L>(a: RemoteData<L, A>): RemoteData<L, [A]>;
export declare function combine<A, B, L>(a: RemoteData<L, A>, b: RemoteData<L, B>): RemoteData<L, [A, B]>;
export declare function combine<A, B, C, L>(a: RemoteData<L, A>, b: RemoteData<L, B>, c: RemoteData<L, C>): RemoteData<L, [A, B, C]>;
export declare function combine<A, B, C, D, L>(a: RemoteData<L, A>, b: RemoteData<L, B>, c: RemoteData<L, C>, d: RemoteData<L, D>): RemoteData<L, [A, B, C, D]>;
export declare function combine<A, B, C, D, E, L>(a: RemoteData<L, A>, b: RemoteData<L, B>, c: RemoteData<L, C>, d: RemoteData<L, D>, e: RemoteData<L, E>): RemoteData<L, [A, B, C, D, E]>;
export declare function combine<A, B, C, D, E, F, L>(a: RemoteData<L, A>, b: RemoteData<L, B>, c: RemoteData<L, C>, d: RemoteData<L, D>, e: RemoteData<L, E>, f: RemoteData<L, F>): RemoteData<L, [A, B, C, D, E, F]>;
